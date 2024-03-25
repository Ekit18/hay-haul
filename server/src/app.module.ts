import { CacheModule, CacheModuleAsyncOptions } from '@nestjs/cache-manager';
import { Module, OnApplicationBootstrap } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { redisStore } from 'cache-manager-redis-store';
import { AuthModule } from './auth/auth.module';
import { Otp } from './auth/otp.entity';
import { EmailModule } from './email/email.module';
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
import { Token } from './token/token.entity';
import { TokenModule } from './token/token.module';
import { TriggerService } from './trigger/trigger.service';
import { User } from './user/user.entity';
import { UserModule } from './user/user.module';

export const RedisOptions: CacheModuleAsyncOptions = {
  isGlobal: true,
  imports: [ConfigModule],
  useFactory: async (configService: ConfigService) => {
    const store = await redisStore({
      url: configService.get<string>('REDIS_URL'),
      ttl: Number(configService.get<number>('CACHE_TTL')),
    });
    return {
      store: () => store,
    };
  },
  inject: [ConfigService],
};

@Module({
  imports: [
    // CacheModule.registerAsync<RedisClientOptions>({
    //   imports: [ConfigModule],
    //   isGlobal: true,
    //   useFactory: async (configService: ConfigService) => ({
    //     ttl: Number(configService.get<number>('CACHE_TTL')),
    //     socket: {
    //       host: configService.get<string>('REDIS_HOST'),
    //       port: Number(configService.get<number>('REDIS_PORT')),
    //     },
    //     password: configService.get<string>('REDIS_PASSWORD'),
    //     username: configService.get<string>('REDIS_USER'),
    //   }),
    //   inject: [ConfigService],
    // }),
    CacheModule.registerAsync(RedisOptions),
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
        ],
        // logger: 'simple-console',
        logging: true,
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
    ProductAuctionBidModule,
    NotificationModule,
    SocketModule,
    ProductsAuctionGatewayModule,
    S3FileModule,
  ],
  providers: [TriggerService, FunctionService],
})
export class AppModule implements OnApplicationBootstrap {
  constructor(
    private readonly seedingService: TriggerService,
    private readonly functionService: FunctionService,
  ) {}

  async onApplicationBootstrap(): Promise<void> {
    await this.functionService.seed();
    await this.seedingService.seed();
  }
}
