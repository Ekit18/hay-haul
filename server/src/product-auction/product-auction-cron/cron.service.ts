import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Cron } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { addHours } from 'date-fns';
import { EmailService } from 'src/email/services/email.service';
import { NotificationService } from 'src/notification/notification.service';
import { Repository } from 'typeorm';
import {
  ProductAuction,
  ProductAuctionStatus,
} from '../product-auction.entity';

@Injectable()
export class ProductAuctionCronService {
  // private readonly seekerVirtualAssessmentDoneTemplateId =
  //   this.configService.get<string>(
  //     'SENDGRID_SEEKER_SUBMIT_CONTRACT_PROPOSAL_TEMPLATE_ID',
  //   );
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
      const oneHourFromNow = addHours(now, 1);

      const auctionsToUpdate = await this.productAuctionRepository
        .createQueryBuilder('productAuction')
        .select()
        .where('auctionStatus IN (:...statuses)', {
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
        .innerJoinAndSelect('productAuction.currentMaxBid', 'currentMaxBid')
        .innerJoinAndSelect('currentMaxBid.user', 'maxBidder')
        .getMany();

      for (const auction of auctionsToUpdate) {
        console.log(auction);
        switch (auction.auctionStatus) {
          case ProductAuctionStatus.Inactive:
            if (auction.startDate <= oneHourFromNow) {
              // email/notification to farmer that his auction is about to start
              auction.auctionStatus = ProductAuctionStatus.StartSoon;
            }
            break;
          case ProductAuctionStatus.StartSoon:
            if (auction.startDate <= now) {
              //websocket to bidders that auction is starting
              // email/notification to farmer that his auction is starting
              auction.auctionStatus = ProductAuctionStatus.Active;
            }
            break;
          case ProductAuctionStatus.Active:
            if (auction.endDate <= oneHourFromNow) {
              //websocket to bidders that auction is about to end
              // email/notification to farmer that his auction is about to end
              // email/notification bidders that auction is about to end
              auction.auctionStatus = ProductAuctionStatus.EndSoon;
            }
            break;
          case ProductAuctionStatus.EndSoon:
            if (auction.endDate <= now) {
              if (auction.currentMaxBid) {
                // email/notification winner that he won the auction
                // set the winner of auction
              }
              // websocket to bidders that auction is ended
              // email/notification to farmer that his auction is ended
              auction.auctionStatus = ProductAuctionStatus.Ended;
            }
            break;
          // TODO: add waiting payment
          // case ProductAuctionStatus.WaitingPayment:
          //   if (auction.endDate <= now) {
          //     if (auction.currentMaxBid) {
          //       // email/notification winner that he won the auction
          //       // set the winner of auction
          //     }
          //     // websocket to bidders that auction is ended
          //     // email/notification to farmer that his auction is ended
          //     auction.auctionStatus = ProductAuctionStatus.Ended;
          //   }
          //   break;
        }

        await this.productAuctionRepository.save(auction);
      }
    } catch (error) {
      console.log(error);
    }
  }
}
