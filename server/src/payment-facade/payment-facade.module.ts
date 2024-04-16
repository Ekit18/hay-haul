import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotificationModule } from 'src/notification/notification.module';
import { ProductAuctionPaymentModule } from 'src/product-auction-payment/product-auction-payment.module';
import { ProductAuction } from 'src/product-auction/product-auction.entity';
import { StripeModule } from 'src/stripe/stripe.module';
import { TokenModule } from 'src/token/token.module';
import { UserModule } from 'src/user/user.module';
import { PaymentFacadeController } from './payment-facade.controller';
import { PaymentFacadeService } from './payment-facade.service';

@Module({
  controllers: [PaymentFacadeController],
  imports: [
    ProductAuctionPaymentModule,
    TypeOrmModule.forFeature([ProductAuction]),
    forwardRef(() => StripeModule),
    UserModule,
    TokenModule,
    NotificationModule,
  ],
  providers: [PaymentFacadeService],
  exports: [PaymentFacadeService],
})
export class PaymentFacadeModule {}
