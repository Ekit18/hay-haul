import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductAuctionModule } from 'src/product-auction/product-auction.module';
import { S3FileModule } from 'src/s3-file/s3-file.module';
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
    S3FileModule,
  ],
  exports: [DeliveryOrderService],
})
export class DeliveryOrderModule {}
