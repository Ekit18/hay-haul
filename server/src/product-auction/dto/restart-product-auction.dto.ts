import { PartialType, PickType } from '@nestjs/swagger';
import { CreateProductAuctionDto } from './create-product-auction.dto';

export class RestartProductAuctionDto extends PartialType(
  PickType(CreateProductAuctionDto, ['startDate', 'endDate', 'paymentPeriod']),
) {}
