import { Module } from '@nestjs/common';
import { DeliveryOfferController } from './delivery-offer.controller';
import { DeliveryOfferService } from './delivery-offer.service';

@Module({
  controllers: [DeliveryOfferController],
  providers: [DeliveryOfferService]
})
export class DeliveryOfferModule {}
