import { Transform, Type } from 'class-transformer';
import {
  IsArray,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { SortOrder } from 'src/lib/enums/enums';

export class ProductQueryDto {
  @IsNumber()
  @IsOptional()
  limit?: number;

  @IsNumber()
  @IsOptional()
  offset?: number;

  @IsString()
  @IsOptional()
  searchQuery?: string;

  @IsString()
  @IsOptional()
  farmId?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @Type(() => String)
  @Transform(({ value }) => value.split(','))
  productTypeId?: string[];

  @IsNumber()
  @IsOptional()
  minQuantity?: number;

  @IsNumber()
  @IsOptional()
  maxQuantity?: number;

  @IsEnum(SortOrder)
  nameSort: SortOrder;

  @IsEnum(SortOrder)
  quantitySort: SortOrder;

  @IsEnum(SortOrder)
  productTypeSort: SortOrder;
}
