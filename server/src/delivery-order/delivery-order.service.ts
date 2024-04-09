import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthenticatedRequest } from 'src/lib/types/user.request.type';
import { ProductAuctionService } from 'src/product-auction/product-auction.service';
import { Repository } from 'typeorm';
import { DeliveryOrderErrorMessage } from './delivery-order-error-message.enum';
import { DeliveryOrder } from './delivery-order.entity';
import { CreateDeliveryOrderDto } from './dto/create-delivery-order.dto';

@Injectable()
export class DeliveryOrderService {
  public constructor(
    @InjectRepository(DeliveryOrder)
    private readonly deliveryOrderRepository: Repository<DeliveryOrder>,
    private readonly productAuctionService: ProductAuctionService,
  ) {}

  public async create(
    dto: CreateDeliveryOrderDto,
    auctionId: string,
    req: AuthenticatedRequest,
    depotId: string,
  ) {
    try {
      const userId = req.user.id;

      const auction = await this.productAuctionService.findOneById(auctionId);

      if (userId !== auction.data[0].currentMaxBid.userId) {
        throw new HttpException(
          DeliveryOrderErrorMessage.YouCannotCreateNotYourDeliveryOrder,
          HttpStatus.BAD_REQUEST,
        );
      }

      return await this.deliveryOrderRepository.save({
        ...dto,
        depotId,
        productAuctionId: auctionId,
        userId,
      });
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  public async findAllByUserId(req: AuthenticatedRequest) {
    try {
      const userId = req.user.id;
      const data = await this.deliveryOrderRepository
        .createQueryBuilder('deliveryOrder')
        .innerJoinAndSelect(
          'deliveryOrder.facilityDetails',
          'businessmanFacilityDetails',
        )
        .innerJoinAndSelect('deliveryOrder.productAuction', 'productAuction')
        .innerJoinAndSelect('productAuction.product', 'product')
        .innerJoinAndSelect('product.facilityDetails', 'farmerFacilityDetails')
        .where('deliveryOrder.userId = :userId', { userId })
        .getMany();

      return data;
    } catch (error) {
      console.log(error);
      throw new HttpException(
        DeliveryOrderErrorMessage.FailedToGetOrders,
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
