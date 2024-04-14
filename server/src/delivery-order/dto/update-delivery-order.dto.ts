import { PartialType } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { CreateDeliveryOrderDto } from './create-delivery-order.dto';

export class UpdateDeliveryOrderDto extends PartialType(
  CreateDeliveryOrderDto,
) {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  depotId: string;
}
