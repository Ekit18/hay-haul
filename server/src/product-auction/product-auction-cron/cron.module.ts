import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';

import { TypeOrmModule } from '@nestjs/typeorm';
import { EmailModule } from 'src/email/email.module';
import { NotificationModule } from 'src/notification/notification.module';
import { ProductAuction } from '../product-auction.entity';
import { ProductAuctionCronService } from './cron.service';
import {SendgridEmailProvider} from "../../email/implementations/sendgrid-email/sendgrid-email.provider";

@Module({
  imports: [
    ScheduleModule.forRoot(),
    TypeOrmModule.forFeature([ProductAuction]),
    NotificationModule,
    EmailModule,
  ],

  providers: [ProductAuctionCronService,SendgridEmailProvider],
})
export class ProductAuctionCronModule {}
