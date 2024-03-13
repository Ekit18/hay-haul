import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthenticatedRequest } from 'src/lib/types/user.request.type';
import { ProductAuction } from 'src/product-auction/product-auction.entity';
import { ProductAuctionService } from 'src/product-auction/product-auction.service';
import { UserService } from 'src/user/user.service';
import { Repository } from 'typeorm';
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
    dto: CreateProductAuctionBidDto,
  ) {
    return this.productAuctionBidRepository.manager.transaction(
      'SERIALIZABLE',
      async (transactionalEntityManager) => {
        try {
          await transactionalEntityManager
            .createQueryBuilder(ProductAuction, 'productAuction')
            .setLock('pessimistic_write')
            .where('productAuction.id = :auctionId', { auctionId })
            .getOne();

          //   const productAuctionBids = await transactionalEntityManager.findBy(
          //     ProductAuctionBid,
          //     { auctionId },
          //   );

          //   await new Promise((resolve) => setTimeout(resolve, 20000));

          return await transactionalEntityManager.save(ProductAuctionBid, {
            ...dto,
            auctionId,
            userId,
          });
        } catch (error) {
          console.error(error);
          throw new HttpException(
            ProductAuctionBidErrorMessage.FailedCreateProductAuctionBid,
            HttpStatus.INTERNAL_SERVER_ERROR,
          );
        }
      },
    );
  }
}
