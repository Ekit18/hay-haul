import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Cron } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { isPast, subHours } from 'date-fns';
import { EmailService } from 'src/email/services/email.service';
import { PaymentTargetType, ServerEventName } from 'src/lib/enums/enums';
import { NotificationMessage } from 'src/notification/enums/notification-message.enum';
import { NotificationService } from 'src/notification/notification.service';
import { SocketService } from 'src/socket/socket.service';
import { Repository } from 'typeorm';
import {
  ProductAuction,
  ProductAuctionStatus,
} from '../product-auction.entity';
import { Notifiable } from 'src/notification/notification.entity';
import { ProductAuctionPaymentService } from 'src/product-auction-payment/product-auction-payment.service';


@Injectable()
export class ProductAuctionCronService {
  private readonly logger = new Logger('ProductAuctionCronService');

  constructor(
    private configService: ConfigService,
    @InjectRepository(ProductAuction)
    private productAuctionRepository: Repository<ProductAuction>,
    private notificationService: NotificationService,
    private emailService: EmailService,
    private productAuctionPaymentService: ProductAuctionPaymentService,
  ) { }

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
                Notifiable.ProductAuction
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
                Notifiable.ProductAuction
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
                Notifiable.ProductAuction
              );
              // email/notification bidders that auction is about to end
              auction.bids.forEach(async (bid) => {
                await this.notificationService.createNotification(
                  bid.user.id,
                  auction.id,
                  NotificationMessage.BusinessmanAuctionEndSoon,
                  Notifiable.ProductAuction
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
                  Notifiable.ProductAuction
                );

                auction.auctionStatus = ProductAuctionStatus.Ended;
              } else {
                // email/notification winner that he won the auction
                await this.notificationService.createNotification(
                  auction.product.facilityDetails.user.id,
                  auction.id,
                  NotificationMessage.AuctionEndedWithBids,
                  Notifiable.ProductAuction
                );

                await this.notificationService.createNotification(
                  auction.currentMaxBid.user.id,
                  auction.id,
                  NotificationMessage.BusinessmanAuctionWon,
                  Notifiable.ProductAuction
                );
                // set the winner of auction
                const targetId = auction.id
                const buyerId = auction.currentMaxBid.user.id;
                const sellerId = auction.product.facilityDetails.user.id
                const amount = auction.currentMaxBid.price

                const payment = await this.productAuctionPaymentService.create({
                  targetId,
                  paymentTarget: PaymentTargetType.ProductAuction,
                  buyerId,
                  sellerId,
                  amount,
                });

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
                Notifiable.ProductAuction
              );
              // email/notification to farmer that he has not received payment
              await this.notificationService.createNotification(
                auction.product.facilityDetails.user.id,
                auction.id,
                NotificationMessage.FarmerAuctionPaymentOverdue,
                Notifiable.ProductAuction
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
