import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FacilityDetails } from 'src/facility-details/facility-details.entity';
import { Repository } from 'typeorm';
import { ProductType } from './product-type.entity';

@Injectable()
export class ProductTypeService {
  public constructor(
    @InjectRepository(ProductType)
    private readonly productTypeRepository: Repository<ProductType>,
  ) {}

  public async createMany(
    productTypeNames: string[],
    facility: FacilityDetails,
  ): Promise<ProductType[]> {
    const productTypes: ProductType[] = this.productTypeRepository.create(
      productTypeNames.map((name) => ({ name, facility })),
    );
    await this.productTypeRepository.save(productTypes);
    return productTypes;
  }
}
