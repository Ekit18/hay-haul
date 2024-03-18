import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { SortOrder } from 'src/lib/enums/enums';

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

  @IsNumber()
  @IsOptional()
  minStartDate?: Date;

  @IsNumber()
  @IsOptional()
  maxStartDate?: Date;

  @IsNumber()
  @IsOptional()
  minEndDate?: Date;

  @IsNumber()
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
}
