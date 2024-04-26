import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Delivery } from './delivery.entity';
import { DeliveryService } from './delivery.service';
import { DeliveryController } from './delivery.controller';
import { DeliveryOrderModule } from 'src/delivery-order/delivery-order.module';
import { DeliveryOrder } from 'src/delivery-order/delivery-order.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Delivery, DeliveryOrder])],
    controllers: [DeliveryController],
    providers: [DeliveryService],
    exports: [DeliveryService]
})
export class DeliveryModule { }
