import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { Otp } from './auth/otp.entity';
import { EmailModule } from './email-2/email.module';
import { FacilityDetails } from './facility-details/facility-details.entity';
import { FacilityDetailsModule } from './facility-details/facility-details.module';
import { FunctionService } from './function/function.service';
import { Notification } from './notification/notification.entity';
import { NotificationModule } from './notification/notification.module';
import { ProductAuctionBid } from './product-auction-bid/product-auction-bid.entity';
import { ProductAuctionBidModule } from './product-auction-bid/product-auction-bid.module';
import { ProductAuction } from './product-auction/product-auction.entity';
import { ProductAuctionModule } from './product-auction/product-auction.module';
import { ProductType } from './product-type/product-type.entity';
import { ProductTypeModule } from './product-type/product-type.module';
import { Product } from './product/product.entity';
import { ProductModule } from './product/product.module';
import { ProductsAuctionGatewayModule } from './products-auction-gateway/products-auction-gateway.module';
import { S3ClientModule } from './s3-client/s3-client.module';
import { S3File } from './s3-file/s3-file.entity';
import { S3FileModule } from './s3-file/s3-file.module';
import { SocketModule } from './socket/socket.module';
import { StripeEntry } from './stripe/stripe.entity';
import { StripeModule } from './stripe/stripe.module';
import { Token } from './token/token.entity';
import { TokenModule } from './token/token.module';
import { TriggerService } from './trigger/trigger.service';
import { User } from './user/user.entity';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    CacheModule.register({ isGlobal: true }),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        type: 'sqljs',
        database: new Uint8Array(),
        entities: [
          User,
          Token,
          Product,
          FacilityDetails,
          ProductType,
          Otp,
          ProductAuctionBid,
          ProductAuction,
          Notification,
          S3File,
          StripeEntry,
        ],
      }),
      inject: [ConfigService],
    }),
    TokenModule,
    S3ClientModule,
    S3FileModule,
    AuthModule,
    UserModule,
    EmailModule,
    ProductModule,
    FacilityDetailsModule,
    ProductTypeModule,
    ProductAuctionModule,
    ProductAuctionBidModule,
    NotificationModule,
    SocketModule,
    ProductsAuctionGatewayModule,
    S3FileModule,
    StripeModule,
  ],
  providers: [TriggerService, FunctionService],
})
export class AppModuleTest {}
