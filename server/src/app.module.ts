import { CacheModule, CacheModuleAsyncOptions } from '@nestjs/cache-manager';
import { Module, OnApplicationBootstrap } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { redisStore } from 'cache-manager-redis-store';
import { AuthModule } from './auth/auth.module';
import { Otp } from './auth/otp.entity';
import { DeliveryOffer } from './delivery-offer/delivery-offer.entity';
import { DeliveryOfferModule } from './delivery-offer/delivery-offer.module';
import { DeliveryOrder } from './delivery-order/delivery-order.entity';
import { DeliveryOrderModule } from './delivery-order/delivery-order.module';
import { EmailModule } from './email/email.module';
import { FacilityDetails } from './facility-details/facility-details.entity';
import { FacilityDetailsModule } from './facility-details/facility-details.module';
import { FunctionService } from './function/function.service';
import { Notification } from './notification/notification.entity';
import { NotificationModule } from './notification/notification.module';
import { PaymentFacadeModule } from './payment-facade/payment-facade.module';
import { ProductAuctionBid } from './product-auction-bid/product-auction-bid.entity';
import { ProductAuctionBidModule } from './product-auction-bid/product-auction-bid.module';
import { ProductAuctionPayment } from './product-auction-payment/product-auction-payment.entity';
import { ProductAuctionPaymentModule } from './product-auction-payment/product-auction-payment.module';
import { ProductAuctionCronModule } from './product-auction/product-auction-cron/cron.module';
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
import { DriverDetailsModule } from './driver-details/driver-details.module';
import { DriverDetails } from './driver-details/driver-details.entity';
import { TransportModule } from './transport/transport.module';
import { Transport } from './transport/transport.entity';
import { DeliveryOrderPaymentModule } from './delivery-order-payment/delivery-order-payment.module';
import { DeliveryOrderPayment } from './delivery-order-payment/delivery-order-payment.entity';
import { DeliveryModule } from './delivery/delivery.module';
import { Delivery } from './delivery/delivery.entity';
import { CaslModule } from './casl/casl.module';
import { MapController } from './map/map.controller';
import { MapModule } from './map/map.module';
import { ProcedureService } from './procedures/procedure.service';

@Module({
  imports: [
    CaslModule,
    CacheModule.registerAsync({
      isGlobal: true,
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        const store = await redisStore({
          url: configService.get<string>('REDIS_URL'),
          ttl: Number(configService.get<number>('CACHE_TTL')),
          pingInterval: Number(
            configService.get<number>('REDIS_PING_INTERVAL'),
          ),
        });
        return {
          store: () => store,
        };
      },
      inject: [ConfigService],
    } as CacheModuleAsyncOptions),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        type: 'mssql',
        host: configService.get<string>('DATABASE_HOST'),
        port: Number(configService.get<number>('DATABASE_PORT')),
        username: configService.get<string>('DATABASE_USERNAME'),
        password: configService.get<string>('DATABASE_PASSWORD'),
        database: configService.get<string>('DATABASE_NAME'),
        entities: [
          Delivery,
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
          DeliveryOrder,
          ProductAuctionPayment,
          DeliveryOffer,
          DriverDetails,
          Transport,
          DeliveryOrderPayment
        ],
        // logger: 'simple-console',
        // logging: true,
        synchronize: true,
        options: {
          encrypt: false,
        },
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
    ProductAuctionCronModule,
    ProductAuctionBidModule,
    NotificationModule,
    SocketModule,
    ProductsAuctionGatewayModule,
    S3FileModule,
    StripeModule,
    DeliveryOrderModule,
    DeliveryOfferModule,
    ProductAuctionPaymentModule,
    PaymentFacadeModule,
    DriverDetailsModule,
    TransportModule,
    DeliveryOrderPaymentModule,
    DeliveryModule,
    CaslModule,
    MapModule,
  ],
  providers: [TriggerService, FunctionService, ProcedureService],
})
export class AppModule implements OnApplicationBootstrap {
  constructor(
    private readonly triggerService: TriggerService,
    private readonly functionService: FunctionService,
    private readonly procedureService: ProcedureService,
  ) { }

  async onApplicationBootstrap(): Promise<void> {
    await this.functionService.seed();
    await this.triggerService.seed();
    await this.procedureService.seed();
  }
}
