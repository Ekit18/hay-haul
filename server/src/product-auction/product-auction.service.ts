import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductErrorMessage } from 'src/product/product-error-message.enum';
import { ProductService } from 'src/product/product.service';
import { Repository } from 'typeorm';
import { CreateProductAuctionDto } from './dto/create-product-auction.dto';
import { UpdateProductAuctionDto } from './dto/update-product-auction.dto';
import { ProductAuctionErrorMessage } from './product-auction-error-message.enum';
import { AuctionStatus, ProductAuction } from './product-auction.entity';

@Injectable()
export class ProductAuctionService {
  public constructor(
    @InjectRepository(ProductAuction)
    private productAuctionRepository: Repository<ProductAuction>,
    private productService: ProductService,
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

  async findAll() {
    try {
      return await this.productAuctionRepository.find({
        relations: { currentMaxBid: true },
        select: ['id', 'productId', 'buyoutPrice', 'startDate', 'endDate'],
      });
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
        auctionStatus: AuctionStatus.WaitingPayment,
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
    if (auction.auctionStatus !== AuctionStatus.Inactive) {
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
