import { Module } from '@nestjs/common';
import { DeliveryOrderController } from './delivery-order.controller';
import { DeliveryOrderService } from './delivery-order.service';

@Module({
  controllers: [DeliveryOrderController],
  providers: [DeliveryOrderService]
})
export class DeliveryOrderModule {}
