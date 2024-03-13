import { Controller } from '@nestjs/common';
import { ProductAuctionService } from './product-auction.service';

//TODO:fix this
// @UseGuards(JwtAuthGuard)
// @AllowedRoles(UserRole.Farmer)
@Controller('product-auction')
export class ProductAuctionController {
  constructor(private readonly productAuctionService: ProductAuctionService) {}

  // @Post('/product/:productId')
  // async create(
  //   @Param('productId') productId: string,
  //   @Body() dto: CreateProductAuctionDto,
  // ) {
  //   return this.productAuctionService.create(productId, dto);
  // }

  // @Get('/:userId')
  // async getAllByUserId(@Param('userId') userId: string) {
  //   return this.productAuctionService.findAllByUserId(userId);
  // }

  // @Get('/product/:productId')
  // async getOneByProductId(@Param('productId') productId: string) {
  //   return this.productAuctionService.findOneByProductId(productId);
  // }
}
