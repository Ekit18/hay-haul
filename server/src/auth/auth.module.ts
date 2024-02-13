import { Module, forwardRef } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmailModule } from 'src/email/email.module';
import { FacilityDetailsModule } from 'src/facility-details/facility-details.module';
import { ProductTypeModule } from 'src/product-type/product-type.module';
import { TokenModule } from 'src/token/token.module';
import { UserModule } from 'src/user/user.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { Otp } from './otp.entity';

@Module({
  providers: [AuthService, JwtService],
  controllers: [AuthController],
  imports: [
    TypeOrmModule.forFeature([Otp]),
    forwardRef(() => UserModule),
    TokenModule,
    EmailModule,
    FacilityDetailsModule,
    ProductTypeModule,
  ],
  exports: [AuthService],
})
export class AuthModule {}
