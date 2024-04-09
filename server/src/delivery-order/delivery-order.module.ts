import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductAuctionModule } from 'src/product-auction/product-auction.module';
import { TokenModule } from 'src/token/token.module';
import { DeliveryOrderController } from './delivery-order.controller';
import { DeliveryOrder } from './delivery-order.entity';
import { DeliveryOrderService } from './delivery-order.service';

@Module({
  controllers: [DeliveryOrderController],
  providers: [DeliveryOrderService],
  imports: [
    TypeOrmModule.forFeature([DeliveryOrder]),
    TokenModule,
    ProductAuctionModule,
  ],
})
export class DeliveryOrderModule {}
