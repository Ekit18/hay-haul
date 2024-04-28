import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { AllowedRoles } from 'src/lib/decorators/roles-auth.decorator';
import { AuthenticatedRequest } from 'src/lib/types/user.request.type';
import { UserRole } from 'src/user/user.entity';
import { CreateProductAuctionDto } from './dto/create-product-auction.dto';
import { ProductAuctionQueryDto } from './dto/product-auction-query.dto';
import { RestartProductAuctionDto } from './dto/restart-product-auction.dto';
import { UpdateProductAuctionDto } from './dto/update-product-auction.dto';
import { CustomImageValidationPipe } from './pipes/custom-image-validation-pipe';
import { ProductAuctionService } from './product-auction.service';

@UseGuards(JwtAuthGuard)
@AllowedRoles(UserRole.Farmer, UserRole.Businessman)
@Controller('product-auction')
export class ProductAuctionController {
  private static IMAGE_FIELD_NAME = 'photos';
  constructor(private readonly productAuctionService: ProductAuctionService) { }

  @Post('/product/:productId')
  @UseInterceptors(FilesInterceptor(ProductAuctionController.IMAGE_FIELD_NAME))
  async create(
    @Param('productId') productId: string,
    @Body() dto: CreateProductAuctionDto,
    @UploadedFiles(CustomImageValidationPipe) photos: Express.Multer.File[],
    @Req() req: AuthenticatedRequest,
  ) {
    return this.productAuctionService.create({ productId, dto, photos, req });
  }

  @Get('/product/:productId')
  async getOneByProductId(@Param('productId') productId: string) {
    return this.productAuctionService.findOneByProductId(productId);
  }

  @Get('/filter')
  async getAll(
    @Query() query: ProductAuctionQueryDto,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.productAuctionService.findAll(query, req);
  }

  @AllowedRoles(UserRole.Businessman)
  @Get('/paid-auctions')
  async getPaidAuctions(@Req() req: AuthenticatedRequest) {
    return this.productAuctionService.findAllPaidAuctions(req.user.id);
  }

  @Get('/:id')
  async getOne(@Param('id') id: string, @Req() req: AuthenticatedRequest) {
    return this.productAuctionService.findOneById(id, req);
  } s

  @AllowedRoles(UserRole.Farmer)
  @Get('/filter/farmer')
  async getAllFarmerAuctions(
    @Query() query: ProductAuctionQueryDto,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.productAuctionService.findAll(query, req, true);
  }

  @AllowedRoles(UserRole.Businessman)
  @Get('/filter/businessman')
  async getAllBusinessmanAuctions(
    @Query() query: ProductAuctionQueryDto,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.productAuctionService.findAll(query, req, true);
  }

  @Put('/:id')
  @UseInterceptors(FilesInterceptor(ProductAuctionController.IMAGE_FIELD_NAME))
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateProductAuctionDto,
    @UploadedFiles(CustomImageValidationPipe) photos: Express.Multer.File[],
  ) {
    return this.productAuctionService.update({
      auctionId: id,
      dto: dto,
      photos: photos,
    });
  }

  @Post('/restart/:id')
  async restartAuction(
    @Param('id') id: string,
    @Body() dto: RestartProductAuctionDto,
  ) {
    return this.productAuctionService.restart(id, dto);
  }

  @Delete('/:id')
  async delete(@Param('id') id: string) {
    return this.productAuctionService.remove(id);
  }
}
