import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotificationModule } from 'src/notification/notification.module';
import { ProductAuction } from 'src/product-auction/product-auction.entity';
import { ProductAuctionModule } from 'src/product-auction/product-auction.module';
import { TokenModule } from 'src/token/token.module';
import { UserModule } from 'src/user/user.module';
import { ProductAuctionBidController } from './product-auction-bid.controller';
import { ProductAuctionBid } from './product-auction-bid.entity';
import { ProductAuctionBidService } from './product-auction-bid.service';

@Module({
  controllers: [ProductAuctionBidController],
  providers: [ProductAuctionBidService],
  imports: [
    TypeOrmModule.forFeature([ProductAuctionBid, ProductAuction]),
    ProductAuctionModule,
    UserModule,
    TokenModule,
    NotificationModule,
  ],
})
export class ProductAuctionBidModule {}
