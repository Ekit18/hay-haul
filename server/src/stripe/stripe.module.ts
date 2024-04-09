import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductAuctionModule } from 'src/product-auction/product-auction.module';
import { TokenModule } from 'src/token/token.module';
import { UserModule } from 'src/user/user.module';
import { StripeController } from './stripe.controller';
import { StripeEntry } from './stripe.entity';
import { StripeService } from './stripe.service';

@Module({
  providers: [StripeService],
  imports: [
    TypeOrmModule.forFeature([StripeEntry]),
    TokenModule,
    UserModule,
    ProductAuctionModule,
  ],
  exports: [StripeService],
  controllers: [StripeController],
})
export class StripeModule {}
