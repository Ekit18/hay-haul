import { IsArray, IsDate, IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { SortOrder } from 'src/lib/enums/enums';
import { DeliveryOrderStatus } from '../delivery-order.entity';
import { Transform } from 'class-transformer';

export class DeliveryOrderQueryDto {
  @IsNumber()
  @IsOptional()
  limit?: number;

  @IsNumber()
  @IsOptional()
  offset?: number;

  @IsString()
  @IsOptional()
  chosenCarrierId?: string;

  @IsString()
  @IsOptional()
  productName?: string;

  @IsNumber()
  @IsOptional()
  minDesiredPrice?: number;

  @IsNumber()
  @IsOptional()
  maxDesiredPrice?: number;

  @IsDate()
  @IsOptional()
  minDesiredDate?: Date;

  @IsDate()
  @IsOptional()
  maxDesiredDate?: Date;

  @IsOptional()
  @IsArray()
  @IsEnum(DeliveryOrderStatus, { each: true })
  @Transform(({ value }) =>
    value ? value.split(',').map((k) => DeliveryOrderStatus[k]) : [],
  )
  deliveryOrderStatus?: DeliveryOrderStatus[];

  @IsString()
  @IsOptional()
  fromFarmLocation?: string;

  @IsString()
  @IsOptional()
  toDepotLocation?: string;

  @IsEnum(SortOrder)
  @IsOptional()
  desiredPriceSort?: SortOrder;

  @IsEnum(SortOrder)
  @IsOptional()
  desiredDateSort?: SortOrder;

  @IsEnum(SortOrder)
  @IsOptional()
  startDateSort?: SortOrder;

  @IsEnum(SortOrder)
  @IsOptional()
  deliveryOrderStatusSort?: SortOrder;
}
