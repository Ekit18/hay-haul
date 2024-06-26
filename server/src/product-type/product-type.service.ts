import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  forwardRef,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FacilityDetailsErrorMessage } from 'src/facility-details/facility-details-error-message.enum';
import { FacilityDetails } from 'src/facility-details/facility-details.entity';
import { FacilityDetailsService } from 'src/facility-details/facility-details.service';
import { EntityManager, QueryFailedError, Repository } from 'typeorm';
import { CreateProductTypeDto } from './dto/create-product-type.dto';
import { ProductType } from './product-type.entity';
import { ProductTypeErrorMessage } from './product-type-error-message.enum';
import { DELETE_PRODUCT_TYPE_PROCEDURE_NAME } from 'src/procedures/procedures-data/product.procedure';

@Injectable()
export class ProductTypeService {
  public constructor(
    @InjectRepository(ProductType)
    private readonly productTypeRepository: Repository<ProductType>,
    @Inject(forwardRef(() => FacilityDetailsService))
    private readonly facilityDetailsService: FacilityDetailsService,
  ) { }

  public async createMany(
    productTypeNames: string[],
    facility: FacilityDetails,
  ): Promise<ProductType[]> {
    try {
      const productTypes: ProductType[] = this.productTypeRepository.create(
        productTypeNames.map((name) => ({
          name,
          facilityDetailsId: facility.id,
        })),
      );

      await this.productTypeRepository.save(productTypes);

      return productTypes;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  public async findAllByFacility(facilityId: string): Promise<ProductType[]> {
    try {
      return this.productTypeRepository.find({
        where: { facilityDetailsId: facilityId },
      });
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  public async findOneById(id: string): Promise<ProductType> {
    try {
      return this.productTypeRepository.findOne({ where: { id } });
    } catch (error) { }
  }

  public async create(
    productType: CreateProductTypeDto,
    facilityId: string,
    transactionalEntityManager?: EntityManager
  ): Promise<ProductType> {
    const entityManager = transactionalEntityManager || this.productTypeRepository.manager;

    const facilityDetails =
      await this.facilityDetailsService.getOneById(facilityId);

    if (!facilityDetails) {
      throw new HttpException(
        { message: FacilityDetailsErrorMessage.FacilityDetailsNotFound },
        HttpStatus.BAD_REQUEST,
      );
    }

    return entityManager.save(ProductType, { ...productType, facilityDetails });
  }

  public async update({
    productType,
    id,
  }: {
    productType: CreateProductTypeDto;
    id: string;
  }): Promise<ProductType> {
    try {
      await this.productTypeRepository.update(id, productType);

      return this.productTypeRepository.findOneBy({ id });
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  public async delete(id: string): Promise<void> {
    try {
      const res = await this.productTypeRepository.query(
        `execute [dbo].[${DELETE_PRODUCT_TYPE_PROCEDURE_NAME}] @0`,
        [id],
      );

    } catch (error) {

      if (error instanceof QueryFailedError) {
        const errorObject = error.driverError.originalError.info;

        const triggerErrorMessage = errorObject.message;

        const isTriggerErrorMessage =
          errorObject.procName === `dbo.${DELETE_PRODUCT_TYPE_PROCEDURE_NAME}`;

        throw new HttpException(
          isTriggerErrorMessage
            ? triggerErrorMessage
            : ProductTypeErrorMessage.FailedToDeleteProductType,
          HttpStatus.BAD_REQUEST,
        );
      }

      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
}
