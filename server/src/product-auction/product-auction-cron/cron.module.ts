import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';

import { TypeOrmModule } from '@nestjs/typeorm';
import { EmailModule } from 'src/email/email.module';
import { NotificationModule } from 'src/notification/notification.module';
import { ProductAuction } from '../product-auction.entity';
import { ProductAuctionCronService } from './cron.service';
import {SendgridEmailProvider} from "../../email/implementations/sendgrid-email/sendgrid-email.provider";
import { ProductAuctionPaymentModule } from 'src/product-auction-payment/product-auction-payment.module';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    TypeOrmModule.forFeature([ProductAuction]),
    NotificationModule,
    ProductAuctionPaymentModule,
    EmailModule,
  ],

  providers: [ProductAuctionCronService],
})
export class ProductAuctionCronModule { }
