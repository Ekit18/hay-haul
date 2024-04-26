import { PartialType } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { CreateDeliveryOrderDto } from './create-delivery-order.dto';
import { DeliveryOrderStatus } from '../delivery-order.entity';

export class UpdateDeliveryOrderDto extends PartialType(
  CreateDeliveryOrderDto,
) {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  depotId?: string;

  @IsOptional()
  @IsEnum(DeliveryOrderStatus)
  @IsNotEmpty()
  deliveryOrderStatus?: DeliveryOrderStatus;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  chosenDeliveryOfferId?: string;
}
