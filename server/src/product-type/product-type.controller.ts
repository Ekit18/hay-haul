import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
} from '@nestjs/common';
import { CreateProductTypeDto } from './dto/create-product-type.dto';
import { ProductTypeService } from './product-type.service';

@Controller('product-type')
export class ProductTypeController {
  public constructor(private readonly productTypeService: ProductTypeService) {}

  @Post('/facility/:facilityId')
  public async createProductType(
    @Body() productType: CreateProductTypeDto,
    @Param('facilityId', ParseUUIDPipe) facilityId: string,
  ) {
    return this.productTypeService.create(productType, facilityId);
  }

  @Put('/:id')
  public async updateProductType(
    @Body() productType: CreateProductTypeDto,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    return this.productTypeService.update({
      productType,
      id,
    });
  }

  @Get('/:id')
  public async getProductType(@Param('id', ParseUUIDPipe) id: string) {
    return this.productTypeService.findOneById(id);
  }

  @Get('/facility/:facilityId')
  public async getProductTypesByFacilityId(
    @Param('facilityId', ParseUUIDPipe) facilityId: string,
  ) {
    return this.productTypeService.findAllByFacility(facilityId);
  }

  @Delete('/:id')
  public async deleteProductType(@Param('id', ParseUUIDPipe) id: string) {
    return this.productTypeService.delete(id);
  }
}
