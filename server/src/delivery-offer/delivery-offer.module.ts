import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DeliveryOrderModule } from 'src/delivery-order/delivery-order.module';
import { TokenModule } from 'src/token/token.module';
import { DeliveryOfferController } from './delivery-offer.controller';
import { DeliveryOffer } from './delivery-offer.entity';
import { DeliveryOfferService } from './delivery-offer.service';

@Module({
  controllers: [DeliveryOfferController],
  providers: [DeliveryOfferService],
  imports: [
    TypeOrmModule.forFeature([DeliveryOffer]),
    TokenModule,
    DeliveryOrderModule,
  ],
  exports: [DeliveryOfferService],
})
export class DeliveryOfferModule {}
