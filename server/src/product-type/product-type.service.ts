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
import { Repository } from 'typeorm';
import { CreateProductTypeDto } from './dto/create-product-type.dto';
import { ProductType } from './product-type.entity';

@Injectable()
export class ProductTypeService {
  public constructor(
    @InjectRepository(ProductType)
    private readonly productTypeRepository: Repository<ProductType>,
    @Inject(forwardRef(() => FacilityDetailsService))
    private readonly facilityDetailsService: FacilityDetailsService,
  ) {}

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
    } catch (error) {}
  }

  public async create(
    productType: CreateProductTypeDto,
    facilityId: string,
  ): Promise<ProductType> {
    const facilityDetails =
      await this.facilityDetailsService.getOneById(facilityId);
    if (!facilityDetails) {
      throw new HttpException(
        { message: FacilityDetailsErrorMessage.FacilityDetailsNotFound },
        HttpStatus.BAD_REQUEST,
      );
    }
    return this.productTypeRepository.save(productType);
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
      await this.productTypeRepository.delete(id);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
}
