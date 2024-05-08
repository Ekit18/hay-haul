import { Injectable } from '@nestjs/common';
import { Delivery, DeliveryStatus } from './delivery.entity';
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
import { DriverUpdateDeliveryDto } from './dto/driver-update-delivery.dto';
import { DriverDetails, DriverStatus } from 'src/driver-details/driver-details.entity';
import { ProductService } from 'src/product/product.service';
import { SocketService } from 'src/socket/socket.service';
import { ServerEventName } from 'src/lib/enums/enums';
import { NotificationService } from 'src/notification/notification.service';
import { NotificationMessage } from 'src/notification/enums/notification-message.enum';
import { Notifiable } from 'src/notification/notification.entity';
import { Product } from 'src/product/product.entity';

@Injectable()
export class DeliveryService {
    constructor(
        @InjectRepository(Delivery) private deliveryRepository: Repository<Delivery>,
        @InjectRepository(DeliveryOrder) private deliveryOrderRepository: Repository<DeliveryOrder>,
        @InjectRepository(DriverDetails) private driverDetailsRepository: Repository<DriverDetails>,
        private readonly productService: ProductService,
        private readonly notificationService: NotificationService,
    ) { }
    async getDeliveryStatus(id: string) {
        const delivery = await this.deliveryRepository.findOne({ where: { id } })
        return { deliveryStatus: delivery.status };
    }

    async create(dto: CreateDeliveryDto, req: AuthenticatedRequest) {
        const { user: { id: carrierId } } = req;

        const delivery = await this.deliveryRepository.save({ ...dto, carrierId });

        const driver = await this.driverDetailsRepository.findOne({ where: { id: dto.driverId }, relations: { user: true } })

        await this.notificationService.createNotification(driver.user.id, delivery.id, NotificationMessage.CarrierAssignedDriver, Notifiable.Delivery)

        await this.deliveryOrderRepository.update(dto.deliveryOrderId, { deliveryOrderStatus: DeliveryOrderStatus.Delivering })

        return delivery;
    }

    async update(dto: UpdateDeliveryDto, id: string) {
        return this.deliveryRepository.update({ id }, { ...dto })
    }


    async updateStatusByDriver(id: string, req: AuthenticatedRequest) {

        const delivery = await this.deliveryRepository.findOne({
            where: { id }, relations: {
                deliveryOrder: {
                    chosenDeliveryOffer: true,
                    productAuction: {
                        product: {
                            facilityDetails: {
                                user: true
                            }
                        }
                    }
                }
            }
        })
        // this.deliveryOrderRepository.createQueryBuilder('s').where('deleted at !=')

        let notificationMessage: NotificationMessage;


        switch (delivery.status) {
            case null:
                delivery.status = DeliveryStatus.AwaitingDriver;
                await this.driverDetailsRepository.update(delivery.driverId, { status: DriverStatus.Busy })
                notificationMessage = NotificationMessage.DriverAcceptedDelivery
                break;
            case DeliveryStatus.AwaitingDriver:
                delivery.status = DeliveryStatus.AtFarmerFacility;
                notificationMessage = NotificationMessage.DriverArriveToFarm
                break;
            case DeliveryStatus.AtFarmerFacility:
                delivery.status = DeliveryStatus.Loading
                notificationMessage = NotificationMessage.DriverLoading
                break;
            case DeliveryStatus.Loading:
                delivery.status = DeliveryStatus.OnTheWay
                notificationMessage = NotificationMessage.DriverOnTheWay
                break;
            case DeliveryStatus.OnTheWay:
                delivery.status = DeliveryStatus.AtBusinessFacility
                notificationMessage = NotificationMessage.DriverArriveToBusiness
                break;
            case DeliveryStatus.AtBusinessFacility:
                delivery.status = DeliveryStatus.Unloading
                notificationMessage = NotificationMessage.DriverUnloading
                break;
            case DeliveryStatus.Unloading:
                await this.driverDetailsRepository.update(delivery.driverId, { status: DriverStatus.Idle })
                delivery.status = DeliveryStatus.Finished
                notificationMessage = NotificationMessage.DriverEndedDelivery

                await this.moveProductByDeliveryId(id)

            // TODO:remove
            default:
                break;
        }

        await this.notificationService.createNotification(delivery.deliveryOrder.userId, delivery.deliveryOrder.id, notificationMessage, Notifiable.DeliveryOrder)
        await this.deliveryRepository.save({ id, status: delivery.status })

        //TODO: Notifications and socket emits go here
        const businessmanId = delivery.deliveryOrder.userId;
        const carrierId = delivery.deliveryOrder.chosenDeliveryOffer.userId
        const farmerId = delivery.deliveryOrder.productAuction.product.facilityDetails.user.id;

        SocketService.SocketServer.to([businessmanId, carrierId, farmerId]).emit(
            ServerEventName.DeliveryUpdated,
        );
    }

    async moveProductByDeliveryId(deliveryId: string) {

        const delivery = await this.deliveryRepository.findOne({
            where: { id: deliveryId }, relations: {
                deliveryOrder: {
                    productAuction: {
                        product: true
                    }
                }
            }
        });

        const productId = delivery.deliveryOrder.productAuction.productId
        const businessmanFacilityId = delivery.deliveryOrder.depotId

        await this.productService.createCopyToFacility(productId, businessmanFacilityId)

    }

    async delete(id: string) {
        const delivery = await this.deliveryRepository.findOne({ where: { id }, relations: { deliveryOrder: true } })

        await this.deliveryOrderRepository.update(delivery.deliveryOrderId, { deliveryOrderStatus: DeliveryOrderStatus.Paid })

        return this.deliveryRepository.delete(id);
    }

    async findOne(id: string) {
        return this.deliveryRepository.createQueryBuilder('delivery')
            .leftJoinAndSelect('delivery.driver', 'driver')
            .leftJoin('driver.user', 'driverUser')
            .addSelect(['driverUser.id', 'driverUser.fullName', 'driverUser.email'])
            .leftJoinAndSelect('delivery.transport', 'transport')
            .leftJoinAndSelect('delivery.deliveryOrder', 'deliveryOrder')
            .leftJoinAndSelect('deliveryOrder.productAuction', 'productAuction')
            .leftJoinAndSelect('deliveryOrder.facilityDetails', 'depotFacilityDetails')
            .leftJoinAndSelect('productAuction.product', 'product')
            .leftJoinAndSelect('product.productType', 'productType')
            .leftJoinAndSelect('product.facilityDetails', 'farmFacilityDetails')
            .where('delivery.id = :id', { id })
            .getOne();
    }

    async findAllDriverDeliveries({
        limit = DEFAULT_PAGINATION_LIMIT,
        offset = DEFAULT_PAGINATION_OFFSET,
        ...dto }: FilterDeliveriesDto,
        { user: { id: driverId } }: AuthenticatedRequest) {
        const queryBuilder = await this.getPreFilteredQueryBuilder(dto)
        const [deliveries, total] = await queryBuilder
            .andWhere('driverUser.id = :driverId', { driverId })
            .take(limit)
            .skip(offset)
            .getManyAndCount()

        const pageCount = Math.ceil(total / limit);

        return {
            data: deliveries,
            count: pageCount,
        };
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
