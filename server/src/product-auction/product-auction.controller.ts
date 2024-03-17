import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { CreateProductAuctionDto } from './dto/create-product-auction.dto';
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

  @Get('/:userId')
  async getAllByUserId(@Param('userId') userId: string) {
    return this.productAuctionService.findAllByUserId(userId);
  }

  @Get('/product/:productId')
  async getOneByProductId(@Param('productId') productId: string) {
    return this.productAuctionService.findOneByProductId(productId);
  }

  @Get()
  async getAll() {
    return this.productAuctionService.findAll();
  }

  @Put('/:id')
  async update(@Param('id') id: string, @Body() dto: UpdateProductAuctionDto) {
    return this.productAuctionService.update(id, dto);
  }
}
