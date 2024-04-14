import { Module, forwardRef } from '@nestjs/common';
import { ProductAuctionPaymentModule } from 'src/product-auction-payment/product-auction-payment.module';
import { StripeModule } from 'src/stripe/stripe.module';
import { TokenModule } from 'src/token/token.module';
import { UserModule } from 'src/user/user.module';
import { PaymentFacadeController } from './payment-facade.controller';
import { PaymentFacadeService } from './payment-facade.service';

@Module({
  controllers: [PaymentFacadeController],
  imports: [
    ProductAuctionPaymentModule,
    forwardRef(() => StripeModule),
    UserModule,
    TokenModule,
  ],
  providers: [PaymentFacadeService],
  exports: [PaymentFacadeService],
})
export class PaymentFacadeModule {}
