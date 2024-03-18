import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
} from '@nestjs/common';
import { AuthenticatedRequest } from 'src/lib/types/user.request.type';
import { CreateProductAuctionDto } from './dto/create-product-auction.dto';
import { ProductAuctionQueryDto } from './dto/product-auction-query.dto';
import { UpdateProductAuctionDto } from './dto/update-product-auction.dto';
import { ProductAuctionService } from './product-auction.service';

//TODO:fix this
// @UseGuards(JwtAuthGuard)
// @AllowedRoles(UserRole.Farmer)
@Controller('product-auction')
export class ProductAuctionController {
  constructor(private readonly productAuctionService: ProductAuctionService) {}

  @Post('/product/:productId')
  async create(
    @Param('productId') productId: string,
    @Body() dto: CreateProductAuctionDto,
  ) {
    console.log(dto);
    return this.productAuctionService.create(productId, dto);
  }

  @Get('/product/:productId')
  async getOneByProductId(@Param('productId') productId: string) {
    return this.productAuctionService.findOneByProductId(productId);
  }

  @Get()
  async getAll(
    @Query() query: ProductAuctionQueryDto,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.productAuctionService.findAll(query, req);
  }

  @Put('/:id')
  async update(@Param('id') id: string, @Body() dto: UpdateProductAuctionDto) {
    return this.productAuctionService.update(id, dto);
  }
}
