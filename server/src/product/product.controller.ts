import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  Query,
  Req,
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
import { AllowedRoles } from 'src/lib/decorators/roles-auth.decorator';
import { getSwaggerResponseDescription } from 'src/lib/helpers/getSwaggerResponseDescription';
import { AuthenticatedRequest } from 'src/lib/types/user.request.type';
import { ProductTypeErrorMessage } from 'src/product-type/product-type-error-message.enum';
import { UserRole } from 'src/user/user.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { ProductQueryDto } from './dto/product-query.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductErrorMessage } from './product-error-message.enum';
import { ProductService } from './product.service';

@ApiBearerAuth()
@ApiTags('product')
@UseGuards(JwtAuthGuard)
@AllowedRoles(UserRole.Farmer)
@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @ApiOperation({ summary: 'Return filtered products' })
  @ApiOkResponse({ description: 'Successfully fetch products' })
  @ApiBadRequestResponse({
    description: getSwaggerResponseDescription(
      ProductErrorMessage.FailedFetchProducts,
    ),
  })
  @Get('/filter')
  async filter(
    @Query() query: ProductQueryDto,
    @Req() request: AuthenticatedRequest,
  ) {
    return this.productService.filterAll(query, request);
  }

  @ApiOperation({ summary: 'Return filtered products' })
  @ApiOkResponse({ description: 'Successfully fetch products' })
  @ApiBadRequestResponse({
    description: getSwaggerResponseDescription(
      ProductErrorMessage.FailedFetchProducts,
    ),
  })
  @Get('/not-in-auction')
  async filterNotInAuction(
    @Query() query: ProductQueryDto,
    @Req() request: AuthenticatedRequest,
  ) {
    return this.productService.filterAll(query, request, true);
  }

  @ApiOperation({ summary: 'Return one product' })
  @ApiOkResponse({ description: 'Successfully fetch product' })
  @ApiBadRequestResponse({
    description: getSwaggerResponseDescription(
      ProductErrorMessage.FailedFetchProduct,
    ),
  })
  @Get(':id')
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.productService.findOne(id);
  }

  @ApiOperation({ summary: 'Endpoint for creating product' })
  @ApiCreatedResponse({ description: 'Successfully create product' })
  @ApiBadRequestResponse({
    description: getSwaggerResponseDescription(
      FacilityDetailsErrorMessage.FacilityDetailsNotFound,
      ProductTypeErrorMessage.ProductTypeNotFound,
      ProductErrorMessage.FailedCreateProduct,
    ),
  })
  @Post('/facility/:facilityId/productType/:productTypeId')
  async create(
    @Param('facilityId', ParseUUIDPipe) facilityId: string,
    @Param('productTypeId', ParseUUIDPipe) productTypeId: string,
    @Body() dto: CreateProductDto,
  ) {
    return this.productService.create({ dto, facilityId, productTypeId });
  }

  @ApiOperation({ summary: 'Endpoint for updating product' })
  @ApiOkResponse({ description: 'Successfully update product' })
  @ApiBadRequestResponse({
    description: getSwaggerResponseDescription(
      ProductErrorMessage.UnauthorizedUpdateProduct,
      ProductErrorMessage.FailedUpdateProduct,
    ),
  })
  @Put('/:id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateProductDto: UpdateProductDto,
    @Req() request: AuthenticatedRequest,
  ) {
    return this.productService.update(id, updateProductDto, request);
  }

  @ApiOperation({ summary: 'Endpoint for deleting product' })
  @ApiOkResponse({ description: 'Successfully delete product' })
  @ApiBadRequestResponse({
    description: getSwaggerResponseDescription(
      ProductErrorMessage.FailedDeleteProduct,
    ),
  })
  @Delete(':id')
  async remove(
    @Param('id', ParseUUIDPipe) id: string,
    @Req() request: AuthenticatedRequest,
  ) {
    return this.productService.remove(id, request);
  }
}
