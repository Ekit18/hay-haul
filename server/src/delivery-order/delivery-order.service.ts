import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  DEFAULT_PAGINATION_OFFSET,
  DEFAULT_PAGINATION_LIMIT,
} from 'src/lib/constants/constants';
import { AuthenticatedRequest } from 'src/lib/types/user.request.type';
import { ProductAuctionService } from 'src/product-auction/product-auction.service';
import { S3FileService } from 'src/s3-file/s3-file.service';
import { And, Brackets, LessThanOrEqual, MoreThanOrEqual, Repository, SelectQueryBuilder } from 'typeorm';
import { DeliveryOrderErrorMessage } from './delivery-order-error-message.enum';
import { DeliveryOrder, DeliveryOrderStatus } from './delivery-order.entity';
import { CreateDeliveryOrderDto } from './dto/create-delivery-order.dto';
import { DeliveryOrderQueryDto } from './dto/delivery-order-query.dto';
import { UpdateDeliveryOrderDto } from './dto/update-delivery-order.dto';
import { DeliveryOrderLocationsQueryDto } from './dto/delivery-order-locations-query.dto';
import { DeliveryOrderLocationsQueryResponse } from './dto/delivery-order-locations-query-response.dto';
import { UserRole } from 'src/user/user.entity';

@Injectable()
export class DeliveryOrderService {
  public constructor(
    @InjectRepository(DeliveryOrder)
    private readonly deliveryOrderRepository: Repository<DeliveryOrder>,
    private readonly productAuctionService: ProductAuctionService,
    private s3FileService: S3FileService,
  ) { }

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
      const { data } = await this.findOneById(id);
      const deliveryOrder = data[0];

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

  public async findAllLocations(
    query: DeliveryOrderLocationsQueryDto,
  ): Promise<DeliveryOrderLocationsQueryResponse> {

    const queryBuilder = await this.deliveryOrderRepository
      .createQueryBuilder('order')
      .leftJoinAndSelect('order.facilityDetails', 'facilityDetails')
      .leftJoinAndSelect('order.productAuction', 'productAuction')
      .leftJoinAndSelect('productAuction.product', 'product')
      .leftJoinAndSelect('product.facilityDetails', 'productFacilityDetails');

    if (query.carrierId) {
      queryBuilder.leftJoinAndSelect('order.deliveryOffers', 'deliveryOffers')
        .leftJoinAndSelect('order.chosenDeliveryOffer', 'chosenOffer')
        .where(new Brackets(qb => {
          qb.where('deliveryOffers.userId = :carrierId', { carrierId: query.carrierId })
            .andWhere('order.deliveryOrderStatus = :deliveryOrderStatus', { deliveryOrderStatus: DeliveryOrderStatus.Active });
        }))
        .orWhere(new Brackets(qb => {
          qb.where('chosenOffer.userId = :carrierId', { carrierId: query.carrierId })
            .andWhere('order.deliveryOrderStatus IN (:...statuses)', { statuses: [DeliveryOrderStatus.Paid, DeliveryOrderStatus.WaitingPayment] });
        }));
    }

    if (query.userId) {
      queryBuilder.andWhere('order.userId = :userId', { userId: query.userId });
    }

    if (!query.userId && !query.carrierId) {
      queryBuilder.andWhere('order.deliveryOrderStatus = :deliveryOrderStatus', { deliveryOrderStatus: DeliveryOrderStatus.Active });
    }
    const orders = await queryBuilder.getMany();

    const response: DeliveryOrderLocationsQueryResponse = {
      fromFarmLocations: [],
      toDepotLocations: [],
    };
    for (const order of orders) {
      response.fromFarmLocations.push(
        order.productAuction.product.facilityDetails.address,
      );
      response.toDepotLocations.push(order.facilityDetails.address);
    }
    return response;
  }

  private async getPreFilteredQueryBuilder({
    chosenCarrierId,
    deliveryOrderStatus,
    fromFarmLocation,
    maxDesiredDate,
    minDesiredDate,
    maxDesiredPrice,
    minDesiredPrice,
    productName,
    toDepotLocation,
  }: DeliveryOrderQueryDto,): Promise<SelectQueryBuilder<DeliveryOrder>> {
    const queryBuilder = this.deliveryOrderRepository
      .createQueryBuilder('order')
      .leftJoinAndSelect('order.facilityDetails', 'facilityDetails')
      .leftJoinAndSelect('order.deliveryOffers', 'deliveryOffers')
      .leftJoinAndSelect('order.chosenDeliveryOffer', 'chosenDeliveryOffer')
      .leftJoinAndSelect('order.productAuction', 'productAuction')
      .leftJoinAndSelect('productAuction.product', 'product')
      .leftJoinAndSelect('product.productType', 'productType')
      .leftJoinAndSelect('product.facilityDetails', 'farmerFacilityDetails')

    if (chosenCarrierId) {
      queryBuilder.andWhere('chosenDeliveryOffer.userId = :chosenCarrierId', { chosenCarrierId })
    }
    if (deliveryOrderStatus) {
      queryBuilder.andWhere('order.deliveryOrderStatus IN (:...deliveryOrderStatus)', { deliveryOrderStatus })
    }
    if (fromFarmLocation) {
      queryBuilder.andWhere('farmerFacilityDetails.address = :fromFarmLocation', { fromFarmLocation })
    }
    if (maxDesiredDate) {
      queryBuilder.andWhere('order.desiredDate <= :maxDesiredDate', { maxDesiredDate })
    }
    if (minDesiredDate) {
      queryBuilder.andWhere('order.desiredDate >= :minDesiredDate', { minDesiredDate })
    }
    if (maxDesiredPrice) {
      queryBuilder.andWhere('order.desiredPrice <= :maxDesiredPrice', { maxDesiredPrice })
    }
    if (minDesiredPrice) {
      queryBuilder.andWhere('order.desiredPrice >= :minDesiredPrice', { minDesiredPrice })

    }
    if (productName) {
      queryBuilder.where('product.name LIKE :productName', {
        productName: `%${productName}%`,
      });
    }
    if (toDepotLocation) {
      queryBuilder.andWhere('facilityDetails.address = :toDepotLocation', { toDepotLocation })
    }

    return queryBuilder;
  }



  public async findAllByUserId(
    req: AuthenticatedRequest,
    { limit = DEFAULT_PAGINATION_LIMIT,
      offset = DEFAULT_PAGINATION_OFFSET, ...filterDto }: DeliveryOrderQueryDto,
  ) {
    try {
      const userId = req.user.id;
      const queryBuilder = (await this.getPreFilteredQueryBuilder(filterDto))
        .andWhere('order.userId = :userId', { userId });

      const [deliveryOrders, total] = await queryBuilder
        .take(limit)
        .skip(offset)
        .getManyAndCount();

      const pageCount = Math.ceil(total / limit);

      return {
        data: deliveryOrders,
        count: pageCount,
      };
    } catch (error) {
      console.log(error);
      throw new HttpException(
        DeliveryOrderErrorMessage.FailedToGetOrders,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  public async findAllOrdersForDelivery({ limit = DEFAULT_PAGINATION_LIMIT,
    offset = DEFAULT_PAGINATION_OFFSET, ...filterDto }: DeliveryOrderQueryDto) {
    try {

      const queryBuilder = (await this.getPreFilteredQueryBuilder(filterDto))
        .andWhere('order.deliveryOrderStatus = :status', { status: DeliveryOrderStatus.Paid });

      const [deliveryOrders, total] = await queryBuilder
        .take(limit)
        .skip(offset)
        .getManyAndCount();

      const pageCount = Math.ceil(total / limit);
      return {
        data: deliveryOrders,
        count: pageCount,
      };
    } catch (error) {
      console.log(error);
      throw new HttpException(
        DeliveryOrderErrorMessage.FailedToGetOrders,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  public async findAllDeliveryOrders({ limit = DEFAULT_PAGINATION_LIMIT,
    offset = DEFAULT_PAGINATION_OFFSET, ...filterDto }: DeliveryOrderQueryDto) {
    try {

      const queryBuilder = (await this.getPreFilteredQueryBuilder(filterDto))
        .andWhere('order.deliveryOrderStatus = :status', { status: DeliveryOrderStatus.Active });

      const [deliveryOrders, total] = await queryBuilder
        .take(limit)
        .skip(offset)
        .getManyAndCount();

      const pageCount = Math.ceil(total / limit);
      return {
        data: deliveryOrders,
        count: pageCount,
      };
    } catch (error) {
      console.log(error);
      throw new HttpException(
        DeliveryOrderErrorMessage.FailedToGetOrders,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async findCarrierOffers(req: AuthenticatedRequest, { limit = DEFAULT_PAGINATION_LIMIT,
    offset = DEFAULT_PAGINATION_OFFSET, ...filterDto }: DeliveryOrderQueryDto) {
    try {

      const queryBuilder = (await this.getPreFilteredQueryBuilder(filterDto))
        .andWhere('deliveryOffers.userId = :userId', { userId: req.user.id })
        .leftJoinAndSelect('order.chosenDeliveryOffer', 'chosenOffer')
        .where(new Brackets(qb => {
          qb.where('deliveryOffers.userId = :carrierId', { carrierId: req.user.id })
            .andWhere('order.deliveryOrderStatus = :deliveryOrderStatus', { deliveryOrderStatus: DeliveryOrderStatus.Active });
        }))
        .orWhere(new Brackets(qb => {
          qb.where('chosenOffer.userId = :carrierId', { carrierId: req.user.id })
            .andWhere('order.deliveryOrderStatus IN (:...statuses)', { statuses: [DeliveryOrderStatus.Paid, DeliveryOrderStatus.WaitingPayment, DeliveryOrderStatus.Delivering, DeliveryOrderStatus.Delivered] });
        }));


      const [deliveryOrders, total] = await queryBuilder
        .take(limit)
        .skip(offset)
        .getManyAndCount();

      const pageCount = Math.ceil(total / limit);
      return {
        data: deliveryOrders,
        count: pageCount,
      };
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
      const queryBuilder = this.deliveryOrderRepository
        .createQueryBuilder('deliveryOrder')
        .innerJoinAndSelect(
          'deliveryOrder.facilityDetails',
          'businessmanFacilityDetails',
        )
        .leftJoinAndSelect('deliveryOrder.chosenDeliveryOffer', 'chosenDeliveryOffer')
        .leftJoin('chosenDeliveryOffer.user', 'chosenCarrier')
        .leftJoin('chosenCarrier.facilityDetails', 'chosenCarrierFacilityDetails')
        .addSelect([
          'chosenCarrierFacilityDetails.name',
          'chosenCarrierFacilityDetails.address',
          'chosenCarrier.id', 'chosenCarrier.email', 'chosenCarrier.fullName'
        ])

        .leftJoinAndSelect('deliveryOrder.deliveryOffers', 'deliveryOffers')
        .leftJoin('deliveryOffers.user', 'carrier')
        .addSelect(['carrier.id'])
        .leftJoin('carrier.facilityDetails', 'carrierFacilityDetails')
        .addSelect([
          'carrierFacilityDetails.name',
          'carrierFacilityDetails.address',
        ])

        .innerJoinAndSelect('deliveryOrder.productAuction', 'productAuction')
        .leftJoinAndSelect('productAuction.photos', 'photos')
        .innerJoinAndSelect('productAuction.product', 'product')
        .innerJoinAndSelect('product.productType', 'productType')
        .innerJoinAndSelect('product.facilityDetails', 'farmerFacilityDetails')
        .leftJoin('deliveryOrder.delivery', 'delivery')
        .addSelect(['delivery.status', 'delivery.id'])
        .where('deliveryOrder.id = :id', { id });

      // data.deliveryOffers[0].user.facilityDetails.name


      const [deliveryOrder, total] = await queryBuilder
        .take(DEFAULT_PAGINATION_LIMIT)
        .skip(DEFAULT_PAGINATION_OFFSET)
        .getManyAndCount();

      for await (const photo of deliveryOrder[0].productAuction.photos) {
        photo.signedUrl = await this.s3FileService.getUrlByKey(photo.key);
      }

      const pageCount = Math.ceil(total / DEFAULT_PAGINATION_LIMIT);

      return {
        data: deliveryOrder,
        count: pageCount,
      };
    } catch (error) {
      console.log(error);
      throw new HttpException(
        DeliveryOrderErrorMessage.FailedToGetOrder,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  public async deleteById(id: string, request: AuthenticatedRequest) {
    try {
      const { data } = await this.findOneById(id);
      const deliveryOrder = data[0];

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

  public async update(
    id: string,
    dto: UpdateDeliveryOrderDto,
    request: AuthenticatedRequest,
  ) {
    try {
      const userId = request.user.id;
      const { data } = await this.findOneById(id);
      const deliveryOrder = data[0];


      if (deliveryOrder.userId !== userId) {
        throw new HttpException(
          DeliveryOrderErrorMessage.UnauthorizedUpdateDeliveryOrder,
          HttpStatus.UNAUTHORIZED,
        );
      }

      await this.deliveryOrderRepository.update(id, dto);
    } catch (error) {
      console.log(error)
      throw new HttpException(
        DeliveryOrderErrorMessage.FailedToUpdateDeliveryOrder,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
