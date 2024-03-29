import { Transform } from 'class-transformer';
import {
  IsArray,
  IsDate,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { SortOrder } from 'src/lib/enums/enums';
import { ProductAuctionStatus } from '../product-auction.entity';

export class ProductAuctionQueryDto {
  @IsNumber()
  @IsOptional()
  limit?: number;

  @IsNumber()
  @IsOptional()
  offset?: number;

  @IsString()
  @IsOptional()
  productName?: string;

  @IsNumber()
  @IsOptional()
  minStartPrice?: number;

  @IsNumber()
  @IsOptional()
  maxStartPrice?: number;

  @IsNumber()
  @IsOptional()
  minBuyoutPrice?: number;

  @IsNumber()
  @IsOptional()
  maxBuyoutPrice?: number;

  @IsDate()
  @IsOptional()
  minStartDate?: Date;

  @IsDate()
  @IsOptional()
  maxStartDate?: Date;

  @IsDate()
  @IsOptional()
  minEndDate?: Date;

  @IsDate()
  @IsOptional()
  maxEndDate?: Date;

  @IsNumber()
  @IsOptional()
  minQuantity?: number;

  @IsNumber()
  @IsOptional()
  maxQuantity?: number;

  @IsEnum(SortOrder)
  @IsOptional()
  quantitySort?: SortOrder;

  @IsEnum(SortOrder)
  @IsOptional()
  endDateSort?: SortOrder;

  @IsEnum(SortOrder)
  @IsOptional()
  startDateSort?: SortOrder;

  @IsOptional()
  @IsArray()
  @IsEnum(ProductAuctionStatus, { each: true })
  @Transform(({ value }) =>
    value ? value.split(',').map((k) => ProductAuctionStatus[k]) : [],
  )
  statuses?: ProductAuctionStatus[];
}
