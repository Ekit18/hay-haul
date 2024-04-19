import { IsNumber, IsOptional, IsString } from 'class-validator';

export class DeliveryOrderLocationsQueryDto {
  @IsString()
  @IsOptional()
  userId: string;
}
