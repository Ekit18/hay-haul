import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductModule } from 'src/product/product.module';
import { TokenModule } from 'src/token/token.module';
import { ProductAuctionController } from './product-auction.controller';
import { ProductAuction } from './product-auction.entity';
import { ProductAuctionService } from './product-auction.service';

@Module({
  controllers: [ProductAuctionController],
  providers: [ProductAuctionService],
  imports: [
    TypeOrmModule.forFeature([ProductAuction]),
    ProductModule,
    TokenModule,
  ],
  exports: [ProductAuctionService],
})
export class ProductAuctionModule {}
