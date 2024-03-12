import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { FacilityDetailsErrorMessage } from 'src/facility-details/facility-details-error-message.enum';
import { getSwaggerResponseDescription } from 'src/lib/helpers/getSwaggerResponseDescription';
import { CreateProductTypeDto } from './dto/create-product-type.dto';
import { ProductTypeService } from './product-type.service';

@ApiBearerAuth()
@ApiTags('product-type')
@UseGuards(JwtAuthGuard)
@Controller('product-type')
export class ProductTypeController {
  public constructor(private readonly productTypeService: ProductTypeService) {}

  @ApiOperation({ summary: 'Endpoint for creating product type' })
  @ApiCreatedResponse({ description: 'Operation successful' })
  @ApiBadRequestResponse({
    description: getSwaggerResponseDescription(
      FacilityDetailsErrorMessage.FacilityDetailsNotFound,
    ),
  })
  @Post('/facility/:facilityId')
  public async createProductType(
    @Body() productType: CreateProductTypeDto,
    @Param('facilityId', ParseUUIDPipe) facilityId: string,
  ) {
    return this.productTypeService.create(productType, facilityId);
  }

  @ApiOperation({ summary: 'Endpoint for updating product type' })
  @ApiOkResponse({ description: 'Operation successful' })
  @ApiBadRequestResponse({ description: 'Failed to update' })
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

  @ApiOperation({ summary: 'Return one product type based on id' })
  @ApiOkResponse({ description: 'Operation successful' })
  @ApiBadRequestResponse({ description: 'Failed to fetch' })
  @Get('/:id')
  public async getProductType(@Param('id', ParseUUIDPipe) id: string) {
    return this.productTypeService.findOneById(id);
  }

  @ApiOperation({ summary: 'Return product types based on facility id' })
  @ApiOkResponse({ description: 'Operation successful' })
  @ApiBadRequestResponse({ description: 'Failed to fetch' })
  @Get('/facility/:facilityId')
  public async getProductTypesByFacilityId(
    @Param('facilityId', ParseUUIDPipe) facilityId: string,
  ) {
    return this.productTypeService.findAllByFacility(facilityId);
  }

  @ApiOperation({ summary: 'Endpoint for deleting product type' })
  @ApiOkResponse({ description: 'Operation successful' })
  @ApiBadRequestResponse({ description: 'Failed to delete' })
  @Delete('/:id')
  public async deleteProductType(@Param('id', ParseUUIDPipe) id: string) {
    return this.productTypeService.delete(id);
  }
}
