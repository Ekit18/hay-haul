import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { CompanyDetails } from './company-details/company-details.entity';
import { CompanyDetailsModule } from './company-details/company-details.module';
import { ProductType } from './product-type/product-type.entity';
import { ProductTypeModule } from './product-type/product-type.module';
import { Products } from './products/products.entity';
import { ProductsModule } from './products/products.module';
import { Token } from './token/token.entity';
import { TokenModule } from './token/token.module';
import { User } from './user/user.entity';
import { UserModule } from './user/user.module';

@Module({
  imports: [
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
        entities: [User, Token, Products, CompanyDetails, ProductType],
        synchronize: true,
        options: {
          encrypt: false,
        },
      }),
      inject: [ConfigService],
    }),
    TokenModule,
    AuthModule,
    UserModule,
    CompanyDetailsModule,
    ProductsModule,
    ProductTypeModule,
  ],
})
export class AppModule {}
