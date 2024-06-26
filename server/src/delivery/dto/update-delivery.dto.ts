import { PartialType, PickType } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { CreateDeliveryDto } from './create-delivery.dto';
import { DeliveryStatus } from '../delivery.entity';

export class UpdateDeliveryDto extends PartialType(PickType(CreateDeliveryDto, ['driverId', 'transportId'])) {
    @IsOptional()
    @IsEnum(DeliveryStatus)
    status: DeliveryStatus;
}