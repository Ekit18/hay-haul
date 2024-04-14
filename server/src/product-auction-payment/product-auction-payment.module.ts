import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductAuction } from 'src/product-auction/product-auction.entity';
import { ProductAuctionModule } from 'src/product-auction/product-auction.module';
import { StripeModule } from 'src/stripe/stripe.module';
import { ProductAuctionPayment } from './product-auction-payment.entity';
import { ProductAuctionPaymentService } from './product-auction-payment.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([ProductAuctionPayment, ProductAuction]),
    forwardRef(() => StripeModule),
    ProductAuctionModule,
  ],
  providers: [ProductAuctionPaymentService],
  exports: [ProductAuctionPaymentService],
})
export class ProductAuctionPaymentModule {}
