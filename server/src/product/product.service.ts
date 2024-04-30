import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  forwardRef,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FacilityDetailsErrorMessage } from 'src/facility-details/facility-details-error-message.enum';
import { FacilityDetailsService } from 'src/facility-details/facility-details.service';
import {
  DEFAULT_PAGINATION_OFFSET,
  DEFAULT_PAGINATION_LIMIT,
} from 'src/lib/constants/constants';
import { SortOrder } from 'src/lib/enums/enums';
import { AuthenticatedRequest } from 'src/lib/types/user.request.type';
import { ProductAuctionStatus } from 'src/product-auction/product-auction.entity';
import { ProductTypeErrorMessage } from 'src/product-type/product-type-error-message.enum';
import { ProductTypeService } from 'src/product-type/product-type.service';
import { QueryFailedError, Repository } from 'typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { ProductQueryDto } from './dto/product-query.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductErrorMessage } from './product-error-message.enum';
import { Product } from './product.entity';
import { ProductType } from 'src/product-type/product-type.entity';
import { CREATE_PRODUCT_PROCEDURE_NAME, DELETE_PRODUCT_PROCEDURE_NAME, UPDATE_PRODUCT_PROCEDURE_NAME } from 'src/procedures/procedures-data/product.procedure';

@Injectable()
export class ProductService {
  public constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @Inject(forwardRef(() => FacilityDetailsService))
    private readonly facilityDetailsService: FacilityDetailsService,
    @Inject(forwardRef(() => ProductTypeService)) private readonly productTypeService: ProductTypeService,
    @InjectRepository(ProductType) private readonly productTypeRepository: Repository<ProductType>,


  ) { }

  async createCopyToFacility(id: string, facilityId: string) {
    const { id: productId, ...product } = await this.productRepository.findOne({ where: { id }, relations: { productType: true } });

    await this.productRepository.manager.transaction(async (transactionalEntityManager) => {
      await transactionalEntityManager.update(Product, id, { deletedAt: new Date() })

      const productTypes = await transactionalEntityManager.find(ProductType, {
        where: { facilityDetailsId: facilityId },
      });

      const targetProductType = product.productType.name

      const productType: ProductType | undefined = productTypes.find((type) => type.name === product.productType.name);

      if (productType) {
        product.productType = productType;
      } else {
        const productType = await this.productTypeService.create({ name: targetProductType }, facilityId, transactionalEntityManager)
        product.productType = productType;
      }

      return await transactionalEntityManager.save(Product, {
        ...product,
        facilityDetailsId: facilityId,
      });
    })

  }

  async filterAll(
    {
      limit = DEFAULT_PAGINATION_LIMIT,
      offset = DEFAULT_PAGINATION_OFFSET,
      searchQuery = '',
      facilityId,
      maxQuantity,
      minQuantity,
      productTypeId,
      nameSort,
      productTypeSort,
      quantitySort,
    }: ProductQueryDto,
    request: AuthenticatedRequest,
    withoutAuction = false,
  ) {
    try {
      const userId = request.user.id;

      const queryBuilder = this.productRepository
        .createQueryBuilder('product')
        .leftJoinAndSelect('product.facilityDetails', 'facilityDetails')
        .leftJoinAndSelect('product.productType', 'productType')
        .leftJoinAndSelect('product.productAuction', 'productAuction')
        .andWhere('product.deletedAt IS NULL');

      if (nameSort) {
        queryBuilder.addOrderBy('product.name', nameSort);
      }
      if (quantitySort) {
        queryBuilder.addOrderBy('product.quantity', quantitySort);
      }
      if (productTypeSort) {
        queryBuilder.addOrderBy('productType.name', productTypeSort);
      }
      if (!nameSort && !quantitySort && !productTypeSort) {
        queryBuilder.addOrderBy('product.createdAt', SortOrder.DESC);
      }

      if (facilityId) {
        queryBuilder.andWhere('product.facilityDetailsId = :facilityDetailsId', {
          facilityDetailsId: facilityId,
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

      if (productTypeId && productTypeId.length > 0) {
        console.log(productTypeId);
        queryBuilder.andWhere(
          'product.productType.id IN (:...productTypeIds)',
          {
            productTypeIds: productTypeId,
          },
        );
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
      if (withoutAuction) {
        queryBuilder.andWhere('productAuction.productId IS NULL');
      }

      if (!withoutAuction) {
        queryBuilder.take(limit).skip(offset);
      }

      const [result, total] = await queryBuilder.getManyAndCount();

      const pageCount = Math.ceil(total / limit);
      return {
        data: result,
        count: pageCount,
      };
    } catch (error) {
      console.log(error);
      throw new HttpException(
        ProductErrorMessage.FailedFetchProducts,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findAllByFacilityId(facilityId: string) {
    try {
      return await this.productRepository.find({
        where: { facilityDetailsId: facilityId, deletedAt: null },
      });
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
        relations: { facilityDetails: { user: true }, productAuction: true },
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
      await this.productRepository.query(`execute ${CREATE_PRODUCT_PROCEDURE_NAME} 
      @name=@0,
      @quantity=@1,
      @facilityId=@2,
      @productTypeId=@3
      `, [dto.name, dto.quantity, facilityId, productTypeId])
    } catch (error) {
      if (error instanceof QueryFailedError) {
        const errorObject = error.driverError.originalError.info;

        const triggerErrorMessage = errorObject.message;

        const isTriggerErrorMessage =
          errorObject.procName === `${CREATE_PRODUCT_PROCEDURE_NAME}`;

        throw new HttpException(
          isTriggerErrorMessage
            ? triggerErrorMessage
            : ProductErrorMessage.FailedUpdateProduct,
          HttpStatus.BAD_REQUEST,
        );
      }
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


    try {
      const res = await this.productTypeRepository.query(
        `execute [dbo].[${UPDATE_PRODUCT_PROCEDURE_NAME}] @id=@0, @userId=@1, @name=@2, @quantity=@3`,
        [
          id,
          userId,
          updateProductDto.name ?? null,
          updateProductDto.quantity ?? null,
        ],
      );

    } catch (error) {

      if (error instanceof QueryFailedError) {
        const errorObject = error.driverError.originalError.info;

        const triggerErrorMessage = errorObject.message;

        const isTriggerErrorMessage =
          errorObject.procName === `dbo.${UPDATE_PRODUCT_PROCEDURE_NAME}`;

        throw new HttpException(
          isTriggerErrorMessage
            ? triggerErrorMessage
            : ProductErrorMessage.FailedUpdateProduct,
          HttpStatus.BAD_REQUEST,
        );
      }

      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }

  }

  async remove(id: string, request: AuthenticatedRequest) {
    try {
      // const product = await this.findOne(id);

      const userId = request.user.id;

      // if (product.facilityDetails.user.id !== userId) {
      //   throw new HttpException(
      //     ProductErrorMessage.UnauthorizedUpdateProduct,
      //     HttpStatus.UNAUTHORIZED,
      //   );
      // }

      // if (
      //   product.productAuction &&
      //   product.productAuction.auctionStatus !==
      //   ProductAuctionStatus.Inactive &&
      //   product.productAuction.auctionStatus !== ProductAuctionStatus.StartSoon
      // ) {
      //   throw new HttpException(
      //     ProductErrorMessage.CannotDeleteProductInEndedAuction,
      //     HttpStatus.BAD_REQUEST,
      //   );
      // }

      // await this.productRepository.delete(id);
      const res = await this.productRepository.query(
        `execute [dbo].[${DELETE_PRODUCT_PROCEDURE_NAME}] @id=@0, @userId=@1`,
        [id, userId],

      );
    } catch (error) {
      console.log(error)
      if (error instanceof QueryFailedError) {
        const errorObject = error.driverError.originalError.info;

        const triggerErrorMessage = errorObject.message;

        const isTriggerErrorMessage =
          errorObject.procName === `dbo.${DELETE_PRODUCT_PROCEDURE_NAME}`;

        throw new HttpException(
          isTriggerErrorMessage
            ? triggerErrorMessage
            : ProductErrorMessage.FailedDeleteProduct,
          HttpStatus.BAD_REQUEST,
        );
      }

      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
}
