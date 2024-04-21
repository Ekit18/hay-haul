import { Module } from '@nestjs/common';
import { DeliveryOrderPaymentService } from './delivery-order-payment.service';
import { DeliveryOrderPayment } from './delivery-order-payment.entity';
import { DeliveryOrder } from 'src/delivery-order/delivery-order.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([DeliveryOrderPayment, DeliveryOrder]),],
  exports: [DeliveryOrderPaymentService],
  providers: [DeliveryOrderPaymentService],
})
export class DeliveryOrderPaymentModule { }
