import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentFacadeModule } from 'src/payment-facade/payment-facade.module';
import { ProductAuctionPaymentModule } from 'src/product-auction-payment/product-auction-payment.module';
import { ProductAuctionModule } from 'src/product-auction/product-auction.module';
import { TokenModule } from 'src/token/token.module';
import { UserModule } from 'src/user/user.module';
import { StripeController } from './stripe.controller';
import { StripeEntry } from './stripe.entity';
import { StripeService } from './stripe.service';
import { DeliveryOrderModule } from 'src/delivery-order/delivery-order.module';
import { DeliveryOrderPaymentModule } from 'src/delivery-order-payment/delivery-order-payment.module';

@Module({
  providers: [StripeService],
  imports: [
    forwardRef(() => PaymentFacadeModule),
    TypeOrmModule.forFeature([StripeEntry]),
    TokenModule,
    UserModule,
    ProductAuctionModule,
    forwardRef(() => ProductAuctionPaymentModule),
    DeliveryOrderModule,
    forwardRef(() => DeliveryOrderPaymentModule),
  ],
  exports: [StripeService],
  controllers: [StripeController],
})
export class StripeModule { }
