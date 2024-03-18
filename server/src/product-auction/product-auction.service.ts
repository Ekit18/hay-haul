import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthenticatedRequest } from 'src/lib/types/user.request.type';
import { ProductErrorMessage } from 'src/product/product-error-message.enum';
import { ProductService } from 'src/product/product.service';
import { SocketService } from 'src/socket/socket.service';
import { Repository } from 'typeorm';
import { CreateProductAuctionDto } from './dto/create-product-auction.dto';
import { ProductAuctionQueryDto } from './dto/product-auction-query.dto';
import { UpdateProductAuctionDto } from './dto/update-product-auction.dto';
import { ProductAuctionErrorMessage } from './product-auction-error-message.enum';
import { ProductAuction, ProductAuctionStatus } from './product-auction.entity';

@Injectable()
export class ProductAuctionService {
  public constructor(
    @InjectRepository(ProductAuction)
    private productAuctionRepository: Repository<ProductAuction>,
    private productService: ProductService,
    private socketService: SocketService,
  ) {}

  async create(productId: string, dto: CreateProductAuctionDto) {
    const product = await this.productService.findOne(productId);
    if (!product) {
      throw new HttpException(
        ProductErrorMessage.ProductNotFound,
        HttpStatus.NOT_FOUND,
      );
    }
    try {
      return this.productAuctionRepository.save({ ...dto, productId });
    } catch (error) {
      console.error(error);
      throw new HttpException(
        ProductAuctionErrorMessage.FailedCreateProductAuction,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async setMaxBid(auctionId: string, bidId: string) {
    try {
      await this.productAuctionRepository.save({
        id: auctionId,
        currentMaxBidId: bidId,
      });
    } catch (e) {
      throw new HttpException(e.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async findAll(
    {
      limit,
      offset,
      productName,
      maxBuyoutPrice,
      minBuyoutPrice,
      maxStartDate,
      minStartDate,
      minEndDate,
      minQuantity,
      minStartPrice,
      maxEndDate,
      maxQuantity,
      maxStartPrice,
      endDateSort,
      startDateSort,
    }: ProductAuctionQueryDto,
    request: AuthenticatedRequest,
  ) {
    try {
      const userId = request.user.id;
      const queryBuilder = this.productAuctionRepository
        .createQueryBuilder('productAuction')
        .leftJoinAndSelect('productAuction.product', 'product');

      if (productName) {
        queryBuilder.where('product.name LIKE :productName', {
          productName: `%${productName}%`,
        });
      }

      // TODO: fix this to array that has objects with map of key value to create wheres dynamically

      if (maxBuyoutPrice) {
        queryBuilder.andWhere('productAuction.buyoutPrice <= :maxBuyoutPrice', {
          maxBuyoutPrice,
        });
      }

      if (minBuyoutPrice) {
        queryBuilder.andWhere('productAuction.buyoutPrice >= :minBuyoutPrice', {
          minBuyoutPrice,
        });
      }

      if (maxStartDate) {
        queryBuilder.andWhere('productAuction.startDate <= :maxStartDate', {
          maxStartDate,
        });
      }

      if (minStartDate) {
        queryBuilder.andWhere('productAuction.startDate >= :minStartDate', {
          minStartDate,
        });
      }

      if (maxEndDate) {
        queryBuilder.andWhere('productAuction.endDate <= :maxEndDate', {
          maxEndDate,
        });
      }

      if (minEndDate) {
        queryBuilder.andWhere('productAuction.endDate >= :minEndDate', {
          minEndDate,
        });
      }

      if (minQuantity) {
        queryBuilder.andWhere('product.quantity >= :minQuantity', {
          minQuantity,
        });
      }

      if (maxQuantity) {
        queryBuilder.andWhere('product.quantity <= :maxQuantity', {
          maxQuantity,
        });
      }

      if (minStartPrice) {
        queryBuilder.andWhere('productAuction.startPrice >= :minStartPrice', {
          minStartPrice,
        });
      }

      if (maxStartPrice) {
        queryBuilder.andWhere('productAuction.startPrice <= :maxStartPrice', {
          maxStartPrice,
        });
      }

      if (endDateSort) {
        queryBuilder.orderBy('productAuction.endDate', endDateSort);
      }

      if (startDateSort) {
        queryBuilder.orderBy('productAuction.startDate', startDateSort);
      }

      const [result, total] = await queryBuilder
        .take(limit)
        .skip(offset)
        .getManyAndCount();
      const pageCount = Math.ceil(total / limit);

      return {
        data: result,
        count: pageCount,
      };
    } catch (error) {
      throw new HttpException(
        ProductAuctionErrorMessage.FailedFetchProductAuctions,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findOneByProductId(productId) {
    const product = await this.productService.findOne(productId);
    if (!product) {
      throw new HttpException(
        ProductErrorMessage.ProductNotFound,
        HttpStatus.NOT_FOUND,
      );
    }
    try {
      return this.productAuctionRepository.find({
        where: { productId },
        relations: { bids: true, product: true, currentMaxBid: true },
      });
    } catch (error) {
      throw new HttpException(
        ProductAuctionErrorMessage.FailedFetchProductAuction,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findAllByUserId(userId) {
    try {
      return this.productAuctionRepository
        .createQueryBuilder('productAuction')
        .innerJoin('productAuction.product', 'product')
        .innerJoin('product.facilityDetails', 'facilityDetails')
        .innerJoin('facilityDetails.user', 'user')
        .select('productAuction')
        .where('user.id = :userId', { userId })
        .getMany();
    } catch (error) {
      throw new HttpException(
        ProductAuctionErrorMessage.FailedFetchProductAuction,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async finishAuctionSuccessfully(auctionId: string) {
    try {
      await this.productAuctionRepository.update(auctionId, {
        auctionStatus: ProductAuctionStatus.WaitingPayment,
      });
    } catch (error) {
      throw new HttpException(
        ProductAuctionErrorMessage.FailedFinishAuctionSuccessfully,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async update(auctionId: string, dto: UpdateProductAuctionDto) {
    const auction = await this.productAuctionRepository.findOne({
      where: { id: auctionId },
    });
    if (auction.auctionStatus !== ProductAuctionStatus.Inactive) {
      throw new HttpException(
        ProductAuctionErrorMessage.AuctionNotInactive,
        HttpStatus.BAD_REQUEST,
      );
    }
    try {
      await this.productAuctionRepository.update(auctionId, dto);
    } catch (error) {
      throw new HttpException(
        ProductAuctionErrorMessage.FailedUpdateProductAuction,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
