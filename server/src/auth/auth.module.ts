import { Module, forwardRef } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmailModule } from 'src/email-2/email.module';
import { FacilityDetailsModule } from 'src/facility-details/facility-details.module';
import { ProductTypeModule } from 'src/product-type/product-type.module';
import { StripeModule } from 'src/stripe/stripe.module';
import { TokenModule } from 'src/token/token.module';
import { UserModule } from 'src/user/user.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { Otp } from './otp.entity';
import {EmailService} from "../email-2/email.service";
import {SendGridEmailService} from "../email-2/implementations/sendgrid-email/sendgrid-email.service";

@Module({
  providers: [AuthService, JwtService, {
    provide:EmailService,
    useClass:SendGridEmailService
  }],
  controllers: [AuthController],
  imports: [
    StripeModule,
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
