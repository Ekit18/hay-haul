import { Injectable } from '@nestjs/common';
import { Delivery } from './delivery.entity';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateDeliveryDto } from './dto/create-delivery.dto';
import { TransportService } from 'src/transport/transport.service';
import { DriverDetailsService } from 'src/driver-details/driver-details.service';
import { AuthenticatedRequest } from 'src/lib/types/user.request.type';
import { UpdateDeliveryDto } from './dto/update-delivery.dto';
import { FilterDeliveriesDto } from './dto/filter-deliveries.dto';
import { DEFAULT_PAGINATION_OFFSET, DEFAULT_PAGINATION_LIMIT } from 'src/lib/constants/constants';
import { DeliveryOrderService } from 'src/delivery-order/delivery-order.service';
import { DeliveryOrder, DeliveryOrderStatus } from 'src/delivery-order/delivery-order.entity';

@Injectable()
export class DeliveryService {
    constructor(
        @InjectRepository(Delivery) private deliveryRepository: Repository<Delivery>,
        @InjectRepository(DeliveryOrder) private deliveryOrderRepository: Repository<DeliveryOrder>,
    ) { }

    async create(dto: CreateDeliveryDto, req: AuthenticatedRequest) {
        const { user: { id: carrierId } } = req;
        const delivery = this.deliveryRepository.save({ ...dto, carrierId });
        await this.deliveryOrderRepository.update(dto.deliveryOrderId, { deliveryOrderStatus: DeliveryOrderStatus.Delivering })
        return delivery;
    }

    async update(dto: UpdateDeliveryDto, id: string) {
        return this.deliveryRepository.save({ ...dto, id })
    }

    async delete(id: string) {
        return this.deliveryRepository.delete(id);
    }

    async findOne(id: string) {
        return this.deliveryRepository.findOne({
            where: { id }, relations: {
                driver: true,
                transport: true,
                deliveryOrder: true
            }
        });
    }

    async findAll({
        limit = DEFAULT_PAGINATION_LIMIT,
        offset = DEFAULT_PAGINATION_OFFSET,
        ...dto }: FilterDeliveriesDto,
        { user: { id: carrierId } }: AuthenticatedRequest) {
        console.log('DELIVERY DTO')
        console.log(dto)
        const queryBuilder = await this.getPreFilteredQueryBuilder(dto)
        const [deliveries, total] = await queryBuilder
            .andWhere('delivery.carrierId = :carrierId', { carrierId })
            .take(limit)
            .skip(offset)
            .getManyAndCount()

        const pageCount = Math.ceil(total / limit);

        return {
            data: deliveries,
            count: pageCount,
        };
    }

    private async getPreFilteredQueryBuilder({
        deliveriesStatus, driverId, productName, transportId, deliveriesStatusSort
    }: FilterDeliveriesDto): Promise<SelectQueryBuilder<Delivery>> {
        const queryBuilder = this.deliveryRepository
            .createQueryBuilder('delivery')
            .leftJoinAndSelect('delivery.driver', 'driver')
            .leftJoinAndSelect('driver.user', 'driverUser')
            .leftJoinAndSelect('delivery.transport', 'transport')
            .leftJoinAndSelect('delivery.deliveryOrder', 'deliveryOrder')
            .leftJoinAndSelect('deliveryOrder.productAuction', 'productAuction')
            .leftJoinAndSelect('deliveryOrder.facilityDetails', 'depotFacilityDetails')
            .leftJoinAndSelect('productAuction.product', 'product')
            .leftJoinAndSelect('product.facilityDetails', 'farmFacilityDetails')

        if (driverId) {
            queryBuilder.andWhere('driver.id = :driverId', { driverId })
        }
        if (transportId) {
            queryBuilder.andWhere('transport.id = :transportId', { transportId })
        }
        if (deliveriesStatus) {
            queryBuilder.andWhere('delivery.status IN (:...deliveriesStatus)', { deliveriesStatus })
        }
        if (deliveriesStatusSort) {
            queryBuilder.orderBy('delivery.status', deliveriesStatusSort)
        }

        if (productName) {
            queryBuilder.where('product.name LIKE :productName', {
                productName: `%${productName}%`,
            });
        }

        return queryBuilder;
    }
}
