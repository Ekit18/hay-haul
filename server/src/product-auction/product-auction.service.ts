import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  DEFAULT_OFFSET,
  DEFAULT_PAGINATION_LIMIT,
} from 'src/lib/constants/constants';
import { AuthenticatedRequest } from 'src/lib/types/user.request.type';
import { ProductErrorMessage } from 'src/product/product-error-message.enum';
import { ProductService } from 'src/product/product.service';
import { S3FileService, S3Folder } from 'src/s3-file/s3-file.service';
import { SocketService } from 'src/socket/socket.service';
import { UserRole } from 'src/user/user.entity';
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
    private s3FileService: S3FileService,
  ) {}

  async create({
    productId,
    dto,
    photos,
    req,
  }: {
    productId: string;
    dto: CreateProductAuctionDto;
    photos: Express.Multer.File[];
    req: AuthenticatedRequest;
  }) {
    const userId = req.user.id;
    const product = await this.productService.findOne(productId);

    if (!product) {
      throw new HttpException(
        ProductErrorMessage.ProductNotFound,
        HttpStatus.NOT_FOUND,
      );
    }

    if (product.facilityDetails.user.id !== userId) {
      throw new HttpException(
        ProductAuctionErrorMessage.FacilityNotMatched,
        HttpStatus.BAD_REQUEST,
      );
    }

    try {
      const fileEntities = await this.s3FileService.create(
        photos,
        S3Folder.AUCTION_IMAGES,
      );

      return this.productAuctionRepository.save({
        ...dto,
        productId,
        photos: fileEntities,
      });
    } catch (error) {
      console.error(error);
      throw new HttpException(
        ProductAuctionErrorMessage.FailedCreateProductAuction,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findOneById(id: string) {
    try {
      const auction = await this.productAuctionRepository
        .createQueryBuilder('auction')
        .leftJoinAndSelect('auction.photos', 'photos')
        .leftJoinAndSelect('auction.product', 'product')
        .leftJoinAndSelect('product.productType', 'productType')
        .leftJoinAndSelect('product.facilityDetails', 'facilityDetails')
        .leftJoin('facilityDetails.user', 'user')
        .addSelect('user.id')
        .where('auction.id = :id', { id })
        .getOne();

      for await (const photo of auction.photos) {
        photo.signedUrl = await this.s3FileService.getUrlByKey(photo.key);
      }
      return auction;
    } catch (error) {
      console.log(error);
      throw new HttpException(
        ProductAuctionErrorMessage.FailedFetchProductAuction,
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
      limit = DEFAULT_PAGINATION_LIMIT,
      offset = DEFAULT_OFFSET,
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
      quantitySort,
      statuses,
    }: ProductAuctionQueryDto,
    request: AuthenticatedRequest,
    hasRoleBeChecked = false,
  ) {
    try {
      const userId = request.user.id;
      const queryBuilder = this.productAuctionRepository
        .createQueryBuilder('productAuction')
        .leftJoinAndSelect('productAuction.product', 'product')
        .leftJoinAndSelect('product.facilityDetails', 'facilityDetails')
        .leftJoin('facilityDetails.user', 'user')
        .addSelect('user.id')
        .leftJoinAndSelect('productAuction.currentMaxBid', 'currentMaxBid')
        .leftJoinAndSelect('productAuction.photos', 'photos');

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

      if (statuses) {
        queryBuilder.andWhere('productAuction.auctionStatus IN(:statuses)', {
          statuses: statuses.join(','),
        });
      }

      if (endDateSort) {
        queryBuilder.orderBy('productAuction.endDate', endDateSort);
      }

      if (startDateSort) {
        queryBuilder.orderBy('productAuction.startDate', startDateSort);
      }

      if (quantitySort) {
        queryBuilder.orderBy('product.quantity', quantitySort);
      }

      if (!hasRoleBeChecked) {
        queryBuilder.andWhere(
          'productAuction.auctionStatus IN (:...auctionStatus)',
          {
            auctionStatus: [
              ProductAuctionStatus.Active,
              ProductAuctionStatus.EndSoon,
            ],
          },
        );
      }

      if (hasRoleBeChecked) {
        switch (request.user.role) {
          case UserRole.Farmer:
            queryBuilder.andWhere('facilityDetails.userId = :userId', {
              userId,
            });
            break;
          case UserRole.Businessman:
            queryBuilder.innerJoinAndSelect('productAuction.bids', 'bids');
            queryBuilder.andWhere('bids.userId = :userId', { userId });
            break;
        }
      }

      const [auctions, total] = await queryBuilder
        .take(limit)
        .skip(offset)
        .getManyAndCount();
      const pageCount = Math.ceil(total / limit);

      for await (const auction of auctions) {
        for await (const photo of auction.photos) {
          photo.signedUrl = await this.s3FileService.getUrlByKey(photo.key);
        }
      }

      // auctions.forEach((auction) => {
      // this.socketService.socketServer.socketsJoin(auction.id);
      // })

      return {
        data: auctions,
        count: pageCount,
      };
    } catch (error) {
      console.log(error);
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

  async update({
    photos,
    auctionId,
    dto,
  }: {
    photos: Express.Multer.File[];
    auctionId: string;
    dto: UpdateProductAuctionDto;
  }) {
    // TODO: check if auction is user's auction
    const auction = await this.productAuctionRepository.findOne({
      where: { id: auctionId },
      relations: {
        photos: true,
        product: { facilityDetails: true },
        currentMaxBid: true,
      },
    });
    if (
      auction.auctionStatus !== ProductAuctionStatus.Inactive &&
      auction.auctionStatus !== ProductAuctionStatus.StartSoon
    ) {
      throw new HttpException(
        ProductAuctionErrorMessage.AuctionNotInactive,
        HttpStatus.BAD_REQUEST,
      );
    }
    try {
      console.log(auction);
      const prevPhotosKeys = auction.photos.map((photo) => photo.key);
      await this.s3FileService.removeByKeys(prevPhotosKeys);
      const fileEntities = await this.s3FileService.create(
        photos,
        S3Folder.AUCTION_IMAGES,
      );

      await this.productAuctionRepository.save({
        ...dto,
        id: auctionId,
        photos: fileEntities,
      });
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async remove(auctionId: string) {
    const auction = await this.productAuctionRepository.findOne({
      where: { id: auctionId },
      relations: {
        bids: true,
        product: true,
        currentMaxBid: true,
        photos: true,
      },
    });
    if (
      auction.auctionStatus !== ProductAuctionStatus.Inactive &&
      auction.auctionStatus !== ProductAuctionStatus.StartSoon
    ) {
      throw new HttpException(
        ProductAuctionErrorMessage.FailedRemoveProductAuction,
        HttpStatus.BAD_REQUEST,
      );
    }
    try {
      const photosKeys = auction.photos.map((photo) => photo.key);
      await this.s3FileService.removeByKeys(photosKeys);
      await this.productAuctionRepository.delete(auctionId);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
}
