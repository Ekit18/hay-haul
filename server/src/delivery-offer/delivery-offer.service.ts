import { BadRequestException, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeliveryOrderService } from 'src/delivery-order/delivery-order.service';
import { AuthenticatedRequest } from 'src/lib/types/user.request.type';
import { Repository } from 'typeorm';
import { DeliveryOfferErrorMessage } from './delivery-offer-error-message.enum';
import { DeliveryOffer, DeliveryOfferStatus } from './delivery-offer.entity';
import { CreateDeliveryOfferDto } from './dto/create-delivery-offer.dto';
import { ca, th } from 'date-fns/locale';
import { SocketService } from 'src/socket/socket.service';
import { PaymentTargetType, ServerEventName } from 'src/lib/enums/enums';
import { DeliveryOrder, DeliveryOrderStatus } from 'src/delivery-order/delivery-order.entity';
import { DeliveryOrderPaymentService } from 'src/delivery-order-payment/delivery-order-payment.service';

@Injectable()
export class DeliveryOfferService {
  constructor(
    @InjectRepository(DeliveryOffer)
    private readonly deliveryOfferRepository: Repository<DeliveryOffer>,
    private readonly deliveryOrderService: DeliveryOrderService,
    private readonly deliveryOrderPaymentService: DeliveryOrderPaymentService,
    private socketService: SocketService,
  ) {
  }

  public async acceptOfferById(req: AuthenticatedRequest, id: string) {
    const offer = await this.deliveryOfferRepository.findOne({
      where: { id }, relations: {
        deliveryOrder: {
          user: true
        }
      }
    })
    if (offer.deliveryOrder.user.id !== req.user.id) {
      throw new BadRequestException({ message: 'Can accept only own order offers' })
    }
    await this.deliveryOfferRepository.manager.transaction(
      'SERIALIZABLE',
      async (transactionalEntityManager) => {
        await transactionalEntityManager.save(DeliveryOffer, { id, offerStatus: DeliveryOfferStatus.Accepted })
        const targetId = offer.deliveryOrder.id;
        const buyerId = req.user?.id
        const sellerId = offer.deliveryOrder.chosenDeliveryOffer.user.id;
        const amount = offer.deliveryOrder.chosenDeliveryOffer.price

        await this.deliveryOrderPaymentService.create({
          targetId,
          paymentTarget: PaymentTargetType.DeliveryOrder,
          buyerId,
          sellerId,
          amount,
        }, transactionalEntityManager);
        await transactionalEntityManager.update(DeliveryOrder, offer.deliveryOrder.id, { deliveryOrderStatus: DeliveryOrderStatus.WaitingPayment, chosenDeliveryOfferId: id });
      })
    SocketService.SocketServer.to(offer.deliveryOrder.id).emit(ServerEventName.DeliveryOrderUpdated, {
      deliveryOrderId: offer.deliveryOrder.id,
      deliveryOrderStatus: DeliveryOrderStatus.WaitingPayment,
    });

    //TODO: notify carrier (You won!)

  }


  public async createDeliveryOffer(
    deliveryOrderId: string,
    req: AuthenticatedRequest,
    dto: CreateDeliveryOfferDto,
  ) {
    try {
      const deliveryOrder =
        await this.deliveryOrderService.findOneById(deliveryOrderId);

      const candidateOffer = await this.deliveryOfferRepository.findOne({
        where: {
          deliveryOrderId,
          userId: req.user.id,
        },
        relations: {
          user: {
            facilityDetails: true,
          },
        }
      });

      let offer: DeliveryOffer;

      if (candidateOffer) {
        offer = { ...candidateOffer, price: dto.price };
        // SocketService.SocketServer.to(deliveryOrderId).emit(ServerEventName.DeliveryOrderUpdated, {
        //   deliveryOrderId,
        //   deliveryOrderStatus: deliveryOrder.data[0].deliveryOrderStatus,
        //   deliveryOffers: deliveryOrder.data[0].deliveryOffers.map((deliveryOffer) => deliveryOffer.id === candidateOffer.id ? offer : deliveryOffer),
        // });
        // return
        if (candidateOffer.price === dto.price) {
          throw new HttpException(
            DeliveryOfferErrorMessage.CannotSetSamePrice,
            HttpStatus.BAD_REQUEST,
          )
        }
        await this.deliveryOfferRepository.update({
          userId: req.user.id,
          deliveryOrderId
        }, {
          ...dto,
        });
      } else {

        await this.deliveryOfferRepository.save({
          ...dto,
          deliveryOrderId,
          userId: req.user.id,
        });
      }

      // offer = await this.deliveryOfferRepository.findOne({
      //   where: {
      //     deliveryOrderId,
      //     userId: req.user.id,
      //   },
      //   relations: {
      //     user: {
      //       facilityDetails: true,
      //     },
      //   }
      // });

      const { data: deliveryOrderData } = await this.deliveryOrderService.findOneById(deliveryOrderId);

      const [deliveryOrderWithChangedOffers] = deliveryOrderData

      SocketService.SocketServer.to(deliveryOrderId).emit(ServerEventName.DeliveryOrderUpdated, {
        deliveryOrderId,
        deliveryOrderStatus: deliveryOrderWithChangedOffers.deliveryOrderStatus,
        deliveryOffers: deliveryOrderWithChangedOffers.deliveryOffers,
      });

      return offer;

    } catch (error) {
      throw new HttpException(
        error.message,
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  public async getDeliveryOffersByDeliveryOrderId(deliveryOrderId: string) {
    try {
      return await this.deliveryOfferRepository.find({
        where: { deliveryOrderId },
      });
    } catch (error) {
      throw new HttpException(
        DeliveryOfferErrorMessage.FailedToGetDeliveryOffers,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  public async deleteDeliveryOffer(deliveryOfferId: string, req: AuthenticatedRequest) {
    try {
      const deliveryOffer = await this.deliveryOfferRepository.findOne({ where: { id: deliveryOfferId }, relations: { deliveryOrder: true } });
      if (!deliveryOffer) {
        throw new HttpException(
          DeliveryOfferErrorMessage.CannotDeleteNotOwnedDeliveryOffer,
          HttpStatus.BAD_REQUEST,
        );
      }
      await this.deliveryOfferRepository.delete({ id: deliveryOfferId });

      const deliveryOffers = await this.deliveryOfferRepository.find({ where: { deliveryOrderId: deliveryOffer.deliveryOrder.id }, relations: { user: { facilityDetails: true } } });

      SocketService.SocketServer.to(deliveryOffer.deliveryOrder.id).emit(ServerEventName.DeliveryOrderUpdated, {
        deliveryOrderId: deliveryOffer.deliveryOrder.id,
        deliveryOrderStatus: deliveryOffer.deliveryOrder.deliveryOrderStatus,
        deliveryOffers: deliveryOffers.filter((offer) => offer.id !== deliveryOfferId),
      });
    } catch (error) {
      throw new HttpException(
        error.message,
        HttpStatus.BAD_REQUEST || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

  }
}
