import { Module, OnModuleInit } from '@nestjs/common';
import { InjectRepository, TypeOrmModule } from '@nestjs/typeorm';
import { ProductAuctionModule } from 'src/product-auction/product-auction.module';
import { S3FileModule } from 'src/s3-file/s3-file.module';
import { TokenModule } from 'src/token/token.module';
import { DeliveryOrderController } from './delivery-order.controller';
import { DeliveryOrder } from './delivery-order.entity';
import { DeliveryOrderService } from './delivery-order.service';
import { Repository } from 'typeorm';
import { GET_ALL_LOCATIONS_FUNCTION_NAME } from 'src/function/function-data/delivery-order.function';
import { DeliveryOrderLocationsQueryResponse } from './dto/delivery-order-locations-query-response.dto';
import { DeliveryModule } from 'src/delivery/delivery.module';
import { Delivery } from 'src/delivery/delivery.entity';

@Module({
  controllers: [DeliveryOrderController],
  providers: [DeliveryOrderService],
  imports: [
    TypeOrmModule.forFeature([DeliveryOrder, Delivery]),
    TokenModule,
    DeliveryModule,
    ProductAuctionModule,
    S3FileModule,
  ],
  exports: [DeliveryOrderService],
})
export class DeliveryOrderModule { }
