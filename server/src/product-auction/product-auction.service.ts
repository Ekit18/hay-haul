import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductService } from 'src/product/product.service';
import { Repository } from 'typeorm';
import { ProductAuction } from './product-auction.entity';

@Injectable()
export class ProductAuctionService {
  public constructor(
    @InjectRepository(ProductAuction)
    private productAuctionRepository: Repository<ProductAuction>,
    private productService: ProductService,
  ) {}

  //   async create(productId: string, dto: CreateProductAuctionDto) {
  //     const product = await this.productService.findOne(productId);
  //     if (!product) {
  //       throw new HttpException(
  //         ProductErrorMessage.ProductNotFound,
  //         HttpStatus.NOT_FOUND,
  //       );
  //     }
  //     try {
  //       return this.productAuctionRepository.save({ ...dto, productId });
  //     } catch (error) {
  //       console.error(error);
  //       throw new HttpException(
  //         ProductAuctionErrorMessage.FailedCreateProductAuction,
  //         HttpStatus.INTERNAL_SERVER_ERROR,
  //       );
  //     }
  //   }

  //   async findOneByProductId(productId) {
  //     const product = await this.productService.findOne(productId);
  //     if (!product) {
  //       throw new HttpException(
  //         ProductErrorMessage.ProductNotFound,
  //         HttpStatus.NOT_FOUND,
  //       );
  //     }
  //     try {
  //       return this.productAuctionRepository.find({
  //         where: { productId },
  //         relations: { bids: true, product: true, currentMaxBid: true },
  //       });
  //     } catch (error) {
  //       throw new HttpException(
  //         ProductAuctionErrorMessage.FailedFetchProductAuction,
  //         HttpStatus.INTERNAL_SERVER_ERROR,
  //       );
  //     }
  //   }

  //   async findAllByUserId(userId) {
  //     try {
  //       return this.productAuctionRepository
  //         .createQueryBuilder('productAuction')
  //         .innerJoin('productAuction.product', 'product')
  //         .innerJoin('product.facilityDetails', 'facilityDetails')
  //         .innerJoin('facilityDetails.user', 'user')
  //         .select('productAuction')
  //         .where('user.id = :userId', { userId })
  //         .getMany();
  //     } catch (error) {
  //       throw new HttpException(
  //         ProductAuctionErrorMessage.FailedFetchProductAuction,
  //         HttpStatus.INTERNAL_SERVER_ERROR,
  //       );
  //     }
  //   }
}
