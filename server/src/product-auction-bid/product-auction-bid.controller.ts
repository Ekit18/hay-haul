import { Body, Controller, Param, Post, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { AllowedRoles } from 'src/lib/decorators/roles-auth.decorator';
import { AuthenticatedRequest } from 'src/lib/types/user.request.type';
import { UserRole } from 'src/user/user.entity';
import { CreateProductAuctionBidDto } from './dto/create-product-bid-auction.dto';
import { ProductAuctionBidService } from './product-auction-bid.service';

@UseGuards(JwtAuthGuard)
@AllowedRoles(UserRole.Businessman)
@Controller('product-auction-bid')
export class ProductAuctionBidController {
  constructor(
    private readonly productAuctionBidService: ProductAuctionBidService,
  ) {}

  @Post('/auction/:auctionId')
  async create(
    @Param('auctionId') auctionId: string,
    @Req() request: AuthenticatedRequest,
    @Body() dto: CreateProductAuctionBidDto,
  ): Promise<any> {
    return await this.productAuctionBidService.create(auctionId, request, dto);
  }
}
