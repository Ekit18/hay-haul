import { PartialType, PickType } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { CreateDeliveryDto } from './create-delivery.dto';

export class UpdateDeliveryDto extends PartialType(PickType(CreateDeliveryDto, ['driverId', 'transportId'])) {
}