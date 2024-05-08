import { BadRequestException, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeliveryOrderService } from 'src/delivery-order/delivery-order.service';
import { AuthenticatedRequest } from 'src/lib/types/user.request.type';
import { QueryFailedError, Repository } from 'typeorm';
import { DeliveryOfferErrorMessage } from './delivery-offer-error-message.enum';
import { DeliveryOffer, DeliveryOfferStatus } from './delivery-offer.entity';
import { CreateDeliveryOfferDto } from './dto/create-delivery-offer.dto';
import { ca, th } from 'date-fns/locale';
import { SocketService } from 'src/socket/socket.service';
import { PaymentTargetType, ServerEventName } from 'src/lib/enums/enums';
import { DeliveryOrder, DeliveryOrderStatus } from 'src/delivery-order/delivery-order.entity';
import { DeliveryOrderPaymentService } from 'src/delivery-order-payment/delivery-order-payment.service';
import { NotificationService } from 'src/notification/notification.service';
import { NotificationMessage } from 'src/notification/enums/notification-message.enum';
import { Notifiable } from 'src/notification/notification.entity';
import { CREATE_OFFER_PROCEDURE_NAME } from 'src/procedures/procedures-data/delivery-offer.procedure';

@Injectable()
export class DeliveryOfferService {
  constructor(
    @InjectRepository(DeliveryOffer)
    private readonly deliveryOfferRepository: Repository<DeliveryOffer>,
    private readonly deliveryOrderService: DeliveryOrderService,
    private readonly deliveryOrderPaymentService: DeliveryOrderPaymentService,
    private socketService: SocketService,
    private readonly notificationService: NotificationService,
  ) {
  }

  public async acceptOfferById(req: AuthenticatedRequest, id: string) {
    const offer = await this.deliveryOfferRepository.findOne({
      where: { id }, relations: {
        user: true,
        deliveryOrder: {
          user: true,
        }
      }
    })
    console.log(offer.deliveryOrder.chosenDeliveryOffer)

    if (offer.deliveryOrder.user.id !== req.user.id) {
      throw new BadRequestException({ message: 'Can accept only own order offers' })
    }

    await this.deliveryOrderService.update(offer.deliveryOrder.id, { chosenDeliveryOfferId: id, deliveryOrderStatus: DeliveryOrderStatus.WaitingPayment }, req);

    await this.deliveryOfferRepository.manager.transaction(
      'SERIALIZABLE',
      async (transactionalEntityManager) => {

        await transactionalEntityManager.save(DeliveryOffer, { id, offerStatus: DeliveryOfferStatus.Accepted })
        const targetId = offer.deliveryOrder.id;
        const buyerId = req.user?.id
        const sellerId = offer.user.id;
        const amount = offer.price

        await this.deliveryOrderPaymentService.create({
          targetId,
          paymentTarget: PaymentTargetType.DeliveryOrder,
          buyerId,
          sellerId,
          amount,
        }, transactionalEntityManager);

        await transactionalEntityManager.update(DeliveryOrder, offer.deliveryOrder.id, { deliveryOrderStatus: DeliveryOrderStatus.WaitingPayment, chosenDeliveryOfferId: id });

        await this.notificationService.createNotification(
          offer.user.id,
          offer.deliveryOrder.id,
          NotificationMessage.AcceptedDeliveryOffer,
          Notifiable.DeliveryOrder,
          transactionalEntityManager,
        )
      })

    SocketService.SocketServer.to(offer.deliveryOrder.id).emit(ServerEventName.DeliveryOrderUpdated, {
      deliveryOrderId: offer.deliveryOrder.id,
      deliveryOrderStatus: DeliveryOrderStatus.WaitingPayment,
    });

  }

  public async rejectOfferById(id: string) {
    const offer = await this.deliveryOfferRepository.findOne({
      where: { id }, relations: {
        deliveryOrder: {
          user: true
        }
      }
    })
    console.log(offer)

    await this.deliveryOfferRepository.update({ id }, { offerStatus: DeliveryOfferStatus.Rejected });

    await this.notificationService.createNotification(
      offer.userId,
      offer.deliveryOrder.id,
      NotificationMessage.DeclinedDeliveryOffer,
      Notifiable.DeliveryOrder,
    )

    const deliveryOrder = await this.deliveryOrderService.findOneById(offer.deliveryOrder.id);
    console.log(deliveryOrder.data[0])
    SocketService.SocketServer.to(offer.deliveryOrder.id).emit(ServerEventName.DeliveryOrderUpdated, {
      deliveryOrderId: deliveryOrder.data[0].id,
      deliveryOrderStatus: deliveryOrder.data[0].deliveryOrderStatus,
      deliveryOffers: deliveryOrder.data[0].deliveryOffers,
    });
  }


  public async createDeliveryOffer(
    deliveryOrderId: string,
    req: AuthenticatedRequest,
    dto: CreateDeliveryOfferDto,
  ) {
    try {

      await this.deliveryOfferRepository.query(
        `execute ${CREATE_OFFER_PROCEDURE_NAME} 
        @orderId=@0,
        @price=@1,
        @userId=@2`,
        [deliveryOrderId, dto.price, req.user.id]
      )

      const { data: deliveryOrderData } = await this.deliveryOrderService.findOneById(deliveryOrderId);

      const [deliveryOrderWithChangedOffers] = deliveryOrderData

      SocketService.SocketServer.to(deliveryOrderId).emit(ServerEventName.DeliveryOrderUpdated, {
        deliveryOrderId,
        deliveryOrderStatus: deliveryOrderWithChangedOffers.deliveryOrderStatus,
        deliveryOffers: deliveryOrderWithChangedOffers.deliveryOffers,
      });

      return await this.deliveryOfferRepository.findOne({ where: { deliveryOrderId, userId: req.user.id } });

    } catch (error) {
      console.log(error)
      if (error instanceof QueryFailedError) {
        const errorObject = error.driverError.originalError.info;

        const triggerErrorMessage = errorObject.message;

        const isTriggerErrorMessage =
          errorObject.procName === `${CREATE_OFFER_PROCEDURE_NAME}`;

        throw new HttpException(
          isTriggerErrorMessage
            ? triggerErrorMessage
            : DeliveryOfferErrorMessage.FailedToCreateDeliveryOffer,
          HttpStatus.BAD_REQUEST,
        );
      }

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
      const deliveryOffer = await this.deliveryOfferRepository.findOne({ where: { id: deliveryOfferId, userId: req.user.id }, relations: { deliveryOrder: true } });
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
