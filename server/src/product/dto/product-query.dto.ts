import { Transform, Type } from 'class-transformer';
import { IsArray, IsNumber, IsOptional, IsString } from 'class-validator';

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
}
