import { PartialType, PickType } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { CreateDeliveryDto } from './create-delivery.dto';
import { DeliveryStatus } from '../delivery.entity';

export class DriverUpdateDeliveryDto {
    @IsOptional()
    @IsEnum(DeliveryStatus)
    status: DeliveryStatus;
}