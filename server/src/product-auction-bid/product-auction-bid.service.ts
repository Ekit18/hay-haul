import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthenticatedRequest } from 'src/lib/types/user.request.type';
import {
  AuctionStatus,
  ProductAuction,
} from 'src/product-auction/product-auction.entity';
import { ProductAuctionService } from 'src/product-auction/product-auction.service';
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
          console.log('===================');
          const candidateBid = await transactionalEntityManager.findOneBy(
            ProductAuctionBid,
            {
              userId,
              auctionId,
            },
          );
          console.log('===================2');

          const auction = await transactionalEntityManager
            .createQueryBuilder(ProductAuction, 'productAuction')
            .setLock('pessimistic_write')
            .where('productAuction.id = :auctionId', { auctionId })
            .leftJoinAndSelect('productAuction.currentMaxBid', 'currentMaxBid')
            .getOne();
          console.log('===================2.1');
          console.log(auction);
          // TODO: check that new price is bigger than start price
          if (price < auction.startPrice) {
            throw new HttpException(
              ProductAuctionBidErrorMessage.BidAmountLessThanStartPrice,
              HttpStatus.BAD_REQUEST,
            );
          }

          // TODO: check that (new price - last price) >= bid step
          // DONE
          if (
            auction?.currentMaxBid &&
            price - auction.currentMaxBid.price < auction.bidStep
          ) {
            throw new HttpException(
              ProductAuctionBidErrorMessage.IncorrectBidAmountStep,
              HttpStatus.BAD_REQUEST,
            );
          }

          console.log('===================3');

          let res: UpdateResult | ProductAuctionBid;

          if (candidateBid && candidateBid.price === price) {
            res = await transactionalEntityManager.update(
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
            res = await transactionalEntityManager.save(ProductAuctionBid, {
              ...(candidateBid ? { id: candidateBid.id } : {}),
              price,
              auctionId,
              userId,
            });
          }

          console.log('res', res instanceof ProductAuctionBid);

          await transactionalEntityManager.save(ProductAuction, {
            ...auction,
            currentMaxBidId: 'id' in res ? res.id : candidateBid.id,
          });

          // TODO: check if bet is bigger than buyout price
          if (price >= auction.buyoutPrice) {
            await transactionalEntityManager.update(
              ProductAuction,
              { id: auctionId },
              {
                auctionStatus: AuctionStatus.WaitingPayment,
              },
            );
            //TODO: send notification to user
          }
          return res;
        } catch (error) {
          console.log('===================');
          console.log(error);
          console.log('===================');
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
