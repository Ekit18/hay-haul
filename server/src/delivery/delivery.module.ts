import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Delivery } from './delivery.entity';
import { DeliveryService } from './delivery.service';
import { DeliveryController } from './delivery.controller';
import { DeliveryOrderModule } from 'src/delivery-order/delivery-order.module';
import { DeliveryOrder } from 'src/delivery-order/delivery-order.entity';
import { DriverDetails } from 'src/driver-details/driver-details.entity';
import { ProductModule } from 'src/product/product.module';
import { NotificationModule } from 'src/notification/notification.module';
import { Product } from 'src/product/product.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Delivery, DeliveryOrder, DriverDetails, Product]), ProductModule, NotificationModule],
    controllers: [DeliveryController],
    providers: [DeliveryService],
    exports: [DeliveryService]
})
export class DeliveryModule { }
