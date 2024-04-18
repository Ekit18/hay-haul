import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';

import { TypeOrmModule } from '@nestjs/typeorm';
import { EmailModule } from 'src/email-2/email.module';
import { NotificationModule } from 'src/notification/notification.module';
import { ProductAuction } from '../product-auction.entity';
import { ProductAuctionCronService } from './cron.service';
import {EmailService} from "../../email-2/email.service";
import {SendGridEmailService} from "../../email-2/implementations/sendgrid-email/sendgrid-email.service";

@Module({
  imports: [
    ScheduleModule.forRoot(),
    TypeOrmModule.forFeature([ProductAuction]),
    NotificationModule,
    EmailModule,
  ],

  providers: [ProductAuctionCronService,{
    provide:EmailService,
    useClass:SendGridEmailService
  }],
})
export class ProductAuctionCronModule {}
