import { PartialType, PickType } from '@nestjs/swagger';
import { CreateProductAuctionDto } from './create-product-auction.dto';

export class UpdateProductAuctionDto extends PartialType(
  PickType(CreateProductAuctionDto, [
    'startPrice',
    'buyoutPrice',
    'startDate',
    'endDate',
    'paymentPeriod',
  ]),
) {}
