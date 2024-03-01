import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FacilityDetailsErrorMessage } from 'src/facility-details/facility-details-error-message.enum';
import { FacilityDetailsService } from 'src/facility-details/facility-details.service';
import {
  DEFAULT_OFFSET,
  DEFAULT_PAGINATION_LIMIT,
} from 'src/lib/constants/constants';
import { AuthenticatedRequest } from 'src/lib/types/user.request.type';
import { ProductTypeErrorMessage } from 'src/product-type/product-type-error-message.enum';
import { ProductTypeService } from 'src/product-type/product-type.service';
import { Repository } from 'typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { ProductQueryDto } from './dto/product-query.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductErrorMessage } from './product-error-message.enum';
import { Product } from './product.entity';

@Injectable()
export class ProductService {
  public constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    private readonly facilityDetailsService: FacilityDetailsService,
    private readonly productTypeService: ProductTypeService,
  ) {}

  async filterAll(
    {
      limit = DEFAULT_PAGINATION_LIMIT,
      offset = DEFAULT_OFFSET,
      searchQuery = '',
      farmId,
      maxQuantity,
      minQuantity,
      productTypeId,
    }: ProductQueryDto,
    request: AuthenticatedRequest,
  ) {
    try {
      const userId = request.user.id;

      const queryBuilder = this.productRepository
        .createQueryBuilder('product')
        .leftJoinAndSelect('product.facilityDetails', 'facilityDetails')
        .leftJoinAndSelect('product.productType', 'productType');

      if (farmId) {
        queryBuilder.andWhere('product.facilityDetailsId', {
          facilityDetailsId: farmId,
        });
      } else {
        queryBuilder.andWhere('facilityDetails.userId = :userId', {
          userId,
        });
      }

      if (searchQuery) {
        queryBuilder.andWhere(`product.name LIKE :keyword`, {
          keyword: `%${searchQuery}%`,
        });
      }

      if (productTypeId) {
        queryBuilder.andWhere('product.productType.id = :productTypeId', {
          productTypeId,
        });
      }

      if (maxQuantity) {
        queryBuilder.andWhere('product.quantity <= :maxQuantity', {
          maxQuantity,
        });
      }
      if (minQuantity) {
        queryBuilder.andWhere('product.quantity >= :minQuantity', {
          minQuantity,
        });
      }

      const [result, total] = await queryBuilder
        .take(limit)
        .skip(offset)
        .getManyAndCount();

      return {
        data: result,
        count: total,
      };
    } catch (error) {
      throw new HttpException(
        ProductErrorMessage.FailedFetchProducts,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findOne(id: string) {
    try {
      return await this.productRepository.findOne({
        where: { id },
        relations: { facilityDetails: { user: true } },
      });
    } catch (error) {
      throw new HttpException(
        ProductErrorMessage.FailedFetchProduct,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async create({
    dto,
    facilityId,
    productTypeId,
  }: {
    dto: CreateProductDto;
    facilityId: string;
    productTypeId: string;
  }) {
    const facilityDetails =
      await this.facilityDetailsService.getOneById(facilityId);

    if (!facilityDetails) {
      throw new HttpException(
        FacilityDetailsErrorMessage.FacilityDetailsNotFound,
        HttpStatus.NOT_FOUND,
      );
    }

    const productType =
      await this.productTypeService.findOneById(productTypeId);

    if (!productType) {
      throw new HttpException(
        ProductTypeErrorMessage.ProductTypeNotFound,
        HttpStatus.NOT_FOUND,
      );
    }

    try {
      return await this.productRepository.save({
        name: dto.name,
        quantity: dto.quantity,
        facilityDetails,
        productType,
      });
    } catch (error) {
      throw new HttpException(
        ProductErrorMessage.FailedCreateProduct,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async update(
    id: string,
    updateProductDto: UpdateProductDto,
    request: AuthenticatedRequest,
  ) {
    const userId = request.user.id;

    const product = await this.findOne(id);

    if (product.facilityDetails.user.id !== userId) {
      throw new HttpException(
        ProductErrorMessage.UnauthorizedUpdateProduct,
        HttpStatus.UNAUTHORIZED,
      );
    }

    try {
      return await this.productRepository.save({
        ...updateProductDto,
      });
    } catch (error) {
      throw new HttpException(
        ProductErrorMessage.FailedUpdateProduct,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async remove(id: string) {
    try {
      await this.productRepository.delete(id);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
}
