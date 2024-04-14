import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeliveryOrderService } from 'src/delivery-order/delivery-order.service';
import { AuthenticatedRequest } from 'src/lib/types/user.request.type';
import { Repository } from 'typeorm';
import { DeliveryOfferErrorMessage } from './delivery-offer-error-message.enum';
import { DeliveryOffer } from './delivery-offer.entity';
import { CreateDeliveryOfferDto } from './dto/create-delivery-offer.dto';

@Injectable()
export class DeliveryOfferService {
  constructor(
    @InjectRepository(DeliveryOffer)
    private readonly deliveryOfferRepository: Repository<DeliveryOffer>,
    private readonly deliveryOrderService: DeliveryOrderService,
  ) {}

  public async createDeliveryOffer(
    deliveryOrderId: string,
    req: AuthenticatedRequest,
    dto: CreateDeliveryOfferDto,
  ) {
    try {
      const deliveryOrder =
        await this.deliveryOrderService.findOneById(deliveryOrderId);
      return await this.deliveryOfferRepository.save({
        ...dto,
        deliveryOrderId,
        userId: req.user.id,
      });
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
}
