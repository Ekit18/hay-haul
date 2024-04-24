import { IsString } from 'class-validator';

export class CreateDeliveryDto {
    @IsString()
    driverId: string;

    @IsString()
    transportId: string;

    @IsString()
    deliveryOrderId: string;
}