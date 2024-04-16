import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ServerEventName } from 'src/lib/enums/enums';
import { AuthenticatedRequest } from 'src/lib/types/user.request.type';
import { NotificationMessage } from 'src/notification/enums/notification-message.enum';
import { NotificationService } from 'src/notification/notification.service';
import {
  ProductAuction,
  ProductAuctionStatus,
} from 'src/product-auction/product-auction.entity';
import { ProductAuctionService } from 'src/product-auction/product-auction.service';
import { SocketService } from 'src/socket/socket.service';
import { PRODUCT_AUCTION_MAX_BID_TRIGGER_NAME } from 'src/trigger/trigger-data/product-auction-bid.trigger';
import { UserService } from 'src/user/user.service';
import { QueryFailedError, Repository, UpdateResult } from 'typeorm';
import { CreateProductAuctionBidDto } from './dto/create-product-bid-auction.dto';
import { ProductAuctionBidErrorMessage } from './product-auction-bid-error-message.enum';
import { ProductAuctionBid } from './product-auction-bid.entity';

@Injectable()
export class ProductAuctionBidService {
  public constructor(
    @InjectRepository(ProductAuctionBid)
    private productAuctionBidRepository: Repository<ProductAuctionBid>,
    @InjectRepository(ProductAuction)
    private productAuctionRepository: Repository<ProductAuction>,
    private productAuctionService: ProductAuctionService,
    private userService: UserService,
    private notificationService: NotificationService,
    private socketService: SocketService,
  ) {}

  async create(
    auctionId: string,
    { user: { id: userId } }: AuthenticatedRequest,
    { price }: CreateProductAuctionBidDto,
  ) {
    return this.productAuctionBidRepository.manager.transaction(
      'SERIALIZABLE',
      async (transactionalEntityManager) => {
        try {
          await new Promise((resolve) => setTimeout(resolve, 500));

          const candidateBid = await transactionalEntityManager.findOneBy(
            ProductAuctionBid,
            {
              userId,
              auctionId,
            },
          );

          const auction = await transactionalEntityManager
            .createQueryBuilder(ProductAuction, 'productAuction')
            .setLock('pessimistic_write')
            .where('productAuction.id = :auctionId', { auctionId })
            .leftJoinAndSelect('productAuction.currentMaxBid', 'currentMaxBid')
            .innerJoinAndSelect('productAuction.product', 'product')
            .innerJoinAndSelect('product.facilityDetails', 'facilityDetails')
            .innerJoinAndSelect('facilityDetails.user', 'user')
            .getOne();

          const isAuctionEnded = ![
            ProductAuctionStatus.Active,
            ProductAuctionStatus.EndSoon,
          ].includes(auction.auctionStatus);

          if (isAuctionEnded) {
            throw new HttpException(
              ProductAuctionBidErrorMessage.AuctionNotActive,
              HttpStatus.BAD_REQUEST,
            );
          }

          const isNewBidPriceLowerThanStartPrice = price < auction.startPrice;

          if (isNewBidPriceLowerThanStartPrice) {
            throw new HttpException(
              ProductAuctionBidErrorMessage.BidAmountLessThanStartPrice,
              HttpStatus.BAD_REQUEST,
            );
          }

          const isNewPriceDifferenceLowerThanBidStep =
            auction?.currentMaxBid &&
            price - auction.currentMaxBid.price < auction.bidStep;

          if (isNewPriceDifferenceLowerThanBidStep) {
            throw new HttpException(
              ProductAuctionBidErrorMessage.IncorrectBidAmountStep,
              HttpStatus.BAD_REQUEST,
            );
          }

          let newOrUpdatedUserBid: UpdateResult | ProductAuctionBid;

          const isUserAlreadyHasBidAndPostsSamePrice =
            candidateBid && candidateBid.price === price;

          if (isUserAlreadyHasBidAndPostsSamePrice) {
            newOrUpdatedUserBid = await transactionalEntityManager.update(
              ProductAuctionBid,
              {
                id: candidateBid.id,
              },
              {
                price,
                auctionId,
                userId,
              },
            );
          } else {
            newOrUpdatedUserBid = await transactionalEntityManager.save(
              ProductAuctionBid,
              {
                ...(candidateBid ? { id: candidateBid.id } : {}),
                price,
                auctionId,
                userId,
              },
            );
          }

          //if it's update result it won't have id in it, and we pick it from candidate (same bid entity essentially)
          const currentMaxBidId =
            'id' in newOrUpdatedUserBid
              ? newOrUpdatedUserBid.id
              : candidateBid.id;

          await transactionalEntityManager.update(
            ProductAuction,
            { id: auctionId },
            {
              currentMaxBidId,
            },
          );

          const isBuyoutBid = price >= auction.buyoutPrice;

          if (isBuyoutBid) {
            await transactionalEntityManager.update(
              ProductAuction,
              { id: auctionId },
              {
                auctionStatus: ProductAuctionStatus.WaitingPayment,
              },
            );

            auction.auctionStatus = ProductAuctionStatus.WaitingPayment;

            await this.notificationService.createNotification(
              userId,
              auction.id,
              NotificationMessage.BusinessmanAuctionWon,
              transactionalEntityManager,
            );

            await this.notificationService.createNotification(
              auction.product.facilityDetails.user.id,
              auction.id,
              NotificationMessage.AuctionEndedWithBids,
              transactionalEntityManager,
            );
            //TODO: send notification to user
          }

          //todo: notify current max bidder by socket/email/notifications
          //start

          const previousMaxBidderId = auction.currentMaxBid?.userId;
          if (previousMaxBidderId && previousMaxBidderId !== userId) {
            await this.notificationService.createNotification(
              previousMaxBidderId,
              auction.id,
              NotificationMessage.BidOverbid,
              transactionalEntityManager,
            );
          }

          SocketService.SocketServer.to(auction.id).emit(
            ServerEventName.AuctionUpdated,
            {
              auctionId: auction.id,
              currentMaxBid: price,
              currentMaxBidId: currentMaxBidId,
              currentMaxBidUserId: userId,
              auctionStatus: auction.auctionStatus,
            },
          );

          return newOrUpdatedUserBid;
        } catch (error) {
          console.log(error);
          if (error instanceof QueryFailedError) {
            const errorObject = error.driverError.precedingErrors[0];

            const triggerErrorMessage = errorObject.message;

            const isTriggerErrorMessage =
              errorObject.procName === PRODUCT_AUCTION_MAX_BID_TRIGGER_NAME;

            throw new HttpException(
              isTriggerErrorMessage
                ? triggerErrorMessage
                : ProductAuctionBidErrorMessage.FailedCreateProductAuctionBid,
              HttpStatus.BAD_REQUEST,
            );
          }

          if (error instanceof HttpException) {
            throw error;
          }

          throw new HttpException(
            ProductAuctionBidErrorMessage.FailedCreateProductAuctionBid,
            HttpStatus.INTERNAL_SERVER_ERROR,
          );
        }
      },
    );
  }
}
