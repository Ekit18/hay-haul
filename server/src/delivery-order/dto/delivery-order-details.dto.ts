import { IsNumber, IsOptional } from 'class-validator';

export class DeliveryOrderQueryDto {
  @IsNumber()
  @IsOptional()
  limit?: number;

  @IsNumber()
  @IsOptional()
  offset?: number;
}
