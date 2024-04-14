import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthenticatedRequest } from 'src/lib/types/user.request.type';
import { ProductAuctionService } from 'src/product-auction/product-auction.service';
import { S3FileService } from 'src/s3-file/s3-file.service';
import { Repository } from 'typeorm';
import { DeliveryOrderErrorMessage } from './delivery-order-error-message.enum';
import { DeliveryOrder, DeliveryOrderStatus } from './delivery-order.entity';
import { CreateDeliveryOrderDto } from './dto/create-delivery-order.dto';
import { UpdateDeliveryOrderDto } from './dto/update-delivery-order.dto';

@Injectable()
export class DeliveryOrderService {
  public constructor(
    @InjectRepository(DeliveryOrder)
    private readonly deliveryOrderRepository: Repository<DeliveryOrder>,
    private readonly productAuctionService: ProductAuctionService,
    private s3FileService: S3FileService,
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

  public async startDeliveryOrder(id: string, req: AuthenticatedRequest) {
    try {
      const deliveryOrder = await this.findOneById(id);

      if (deliveryOrder.userId !== req.user.id) {
        throw new HttpException(
          DeliveryOrderErrorMessage.UnauthorizedStartDeliveryOrder,
          HttpStatus.UNAUTHORIZED,
        );
      }

      if (deliveryOrder.deliveryOrderStatus !== DeliveryOrderStatus.Inactive) {
        throw new HttpException(
          DeliveryOrderErrorMessage.CannotStartActiveDeliveryOrder,
          HttpStatus.BAD_REQUEST,
        );
      }

      deliveryOrder.deliveryOrderStatus = DeliveryOrderStatus.Active;

      await this.deliveryOrderRepository.save(deliveryOrder);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
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
        .leftJoinAndSelect('deliveryOrder.deliveryOffers', 'deliveryOffers')
        .innerJoinAndSelect('deliveryOrder.productAuction', 'productAuction')
        .innerJoinAndSelect('productAuction.product', 'product')
        .innerJoinAndSelect('product.productType', 'productType')
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

  public async findOneById(id: string) {
    try {
      const data = await this.deliveryOrderRepository
        .createQueryBuilder('deliveryOrder')
        .innerJoinAndSelect(
          'deliveryOrder.facilityDetails',
          'businessmanFacilityDetails',
        )
        .leftJoinAndSelect('deliveryOrder.deliveryOffers', 'deliveryOffers')
        .innerJoinAndSelect('deliveryOrder.productAuction', 'productAuction')
        .leftJoinAndSelect('productAuction.photos', 'photos')
        .innerJoinAndSelect('productAuction.product', 'product')
        .innerJoinAndSelect('product.productType', 'productType')
        .innerJoinAndSelect('product.facilityDetails', 'farmerFacilityDetails')
        .where('deliveryOrder.id = :id', { id })
        .getOne();

      for await (const photo of data.productAuction.photos) {
        photo.signedUrl = await this.s3FileService.getUrlByKey(photo.key);
      }

      return data;
    } catch (error) {
      throw new HttpException(
        DeliveryOrderErrorMessage.FailedToGetOrder,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  public async deleteById(id: string, request: AuthenticatedRequest) {
    try {
      const deliveryOrder = await this.findOneById(id);

      const userId = request.user.id;

      if (deliveryOrder.userId !== userId) {
        throw new HttpException(
          DeliveryOrderErrorMessage.UnauthorizedDeleteDeliveryOrder,
          HttpStatus.UNAUTHORIZED,
        );
      }

      if (deliveryOrder.deliveryOrderStatus !== DeliveryOrderStatus.Inactive) {
        throw new HttpException(
          DeliveryOrderErrorMessage.CannotDeleteActiveDeliveryOrder,
          HttpStatus.BAD_REQUEST,
        );
      }

      await this.deliveryOrderRepository.delete(id);
    } catch (error) {
      throw new HttpException(
        DeliveryOrderErrorMessage.FailedToDeleteDeliveryOrder,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  public async update(id: string, dto: UpdateDeliveryOrderDto, request: AuthenticatedRequest) {
    try {
      const userId = request.user.id;
      const deliveryOrder = await this.findOneById(id);

      if (deliveryOrder.deliveryOrderStatus !== DeliveryOrderStatus.Inactive) {
        throw new HttpException(
          DeliveryOrderErrorMessage.CannotUpdateActiveDeliveryOrder,
          HttpStatus.BAD_REQUEST,
        );
      }

      if (deliveryOrder.userId !== userId) {
        throw new HttpException(
          DeliveryOrderErrorMessage.UnauthorizedUpdateDeliveryOrder,
          HttpStatus.UNAUTHORIZED,
        );
      }

      await this.deliveryOrderRepository.update(id, dto);
    } catch (error) {
      throw new HttpException(
        DeliveryOrderErrorMessage.FailedToUpdateDeliveryOrder,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
