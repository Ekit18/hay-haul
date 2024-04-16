import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Cron } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { isPast, subHours } from 'date-fns';
import { EmailService } from 'src/email/services/email.service';
import { ServerEventName } from 'src/lib/enums/enums';
import { NotificationMessage } from 'src/notification/enums/notification-message.enum';
import { NotificationService } from 'src/notification/notification.service';
import { SocketService } from 'src/socket/socket.service';
import { Repository } from 'typeorm';
import {
  ProductAuction,
  ProductAuctionStatus,
} from '../product-auction.entity';

@Injectable()
export class ProductAuctionCronService {
  private readonly logger = new Logger('ProductAuctionCronService');

  constructor(
    private configService: ConfigService,
    @InjectRepository(ProductAuction)
    private productAuctionRepository: Repository<ProductAuction>,
    private notificationService: NotificationService,
    private emailService: EmailService,
  ) {}

  @Cron('1 * * * * *')
  async updateAuctionStatus(): Promise<void> {
    try {
      this.logger.log('Updating auction status');

      const now = new Date();
      now.setMilliseconds(0);
      now.setSeconds(0);

      const auctionsToUpdate = await this.productAuctionRepository
        .createQueryBuilder('productAuction')
        .where('productAuction.auctionStatus IN (:...statuses)', {
          statuses: [
            ProductAuctionStatus.Inactive,
            ProductAuctionStatus.StartSoon,
            ProductAuctionStatus.Active,
            ProductAuctionStatus.EndSoon,
          ],
        })
        .innerJoinAndSelect('productAuction.product', 'product')
        .innerJoinAndSelect('product.facilityDetails', 'facilityDetails')
        .innerJoinAndSelect('facilityDetails.user', 'user')
        .leftJoinAndSelect('productAuction.currentMaxBid', 'currentMaxBid')
        .leftJoinAndSelect('productAuction.bids', 'bids')
        .leftJoinAndSelect('currentMaxBid.user', 'maxBidder')
        .getMany();

      for (const auction of auctionsToUpdate) {
        const initialStatus = auction.auctionStatus;

        switch (auction.auctionStatus) {
          case ProductAuctionStatus.Inactive:
            if (isPast(subHours(auction.startDate, 1))) {
              // email/notification to farmer that his auction is about to start
              await this.notificationService.createNotification(
                auction.product.facilityDetails.user.id,
                auction.id,
                NotificationMessage.AuctionStartSoon,
              );
              auction.auctionStatus = ProductAuctionStatus.StartSoon;
            }
            break;
          case ProductAuctionStatus.StartSoon:
            if (isPast(auction.startDate)) {
              // email/notification to farmer that his auction is starting
              await this.notificationService.createNotification(
                auction.product.facilityDetails.user.id,
                auction.id,
                NotificationMessage.AuctionStarted,
              );
              auction.auctionStatus = ProductAuctionStatus.Active;
            }
            break;
          case ProductAuctionStatus.Active:
            if (isPast(subHours(auction.endDate, 1))) {
              // email/notification to farmer that his auction is about to end
              await this.notificationService.createNotification(
                auction.product.facilityDetails.user.id,
                auction.id,
                NotificationMessage.FarmerAuctionEndSoon,
              );
              // email/notification bidders that auction is about to end
              auction.bids.forEach(async (bid) => {
                await this.notificationService.createNotification(
                  bid.user.id,
                  auction.id,
                  NotificationMessage.BusinessmanAuctionEndSoon,
                );
              });

              auction.auctionStatus = ProductAuctionStatus.EndSoon;
            }
            break;
          case ProductAuctionStatus.EndSoon:
            if (isPast(auction.endDate)) {
              if (!auction.currentMaxBidId) {
                // email/notification to farmer that his auction is ended
                await this.notificationService.createNotification(
                  auction.product.facilityDetails.user.id,
                  auction.id,
                  NotificationMessage.AuctionEndedNoBids,
                );

                auction.auctionStatus = ProductAuctionStatus.Ended;
              } else {
                // email/notification winner that he won the auction
                await this.notificationService.createNotification(
                  auction.product.facilityDetails.user.id,
                  auction.id,
                  NotificationMessage.AuctionEndedWithBids,
                );

                await this.notificationService.createNotification(
                  auction.currentMaxBid.user.id,
                  auction.id,
                  NotificationMessage.BusinessmanAuctionWon,
                );
                // set the winner of auction
                auction.auctionStatus = ProductAuctionStatus.WaitingPayment;
              }
            }
            break;
          case ProductAuctionStatus.WaitingPayment:
            if (isPast(auction.paymentPeriod)) {
              // email/notification to winner that he has not paid
              await this.notificationService.createNotification(
                auction.currentMaxBid.user.id,
                auction.id,
                NotificationMessage.BusinessmanAuctionPaymentOverdue,
              );
              // email/notification to farmer that he has not received payment
              await this.notificationService.createNotification(
                auction.product.facilityDetails.user.id,
                auction.id,
                NotificationMessage.FarmerAuctionPaymentOverdue,
              );

              auction.auctionStatus = ProductAuctionStatus.Unpaid;
            }
            break;
        }

        await this.productAuctionRepository.save(auction);

        if (initialStatus !== auction.auctionStatus) {
          this.logger.log(
            `Updating auction:${auction.id} to status: ${auction.auctionStatus}`,
          );
          SocketService.SocketServer.to(auction.id).emit(
            ServerEventName.AuctionUpdated,
            {
              auctionId: auction.id,
              auctionStatus: auction.auctionStatus,
            },
          );
        }
      }
    } catch (error) {
      this.logger.error('Failed to update auction status', error.stack);
    }
  }
}
