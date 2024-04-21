import { IsEnum, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { TransportType } from '../transport.entity';

export class CreateTransportDto {

    @IsString()
    @IsNotEmpty()
    readonly name: string;

    @IsString()
    @IsNotEmpty()
    readonly licensePlate: string;

    @IsNumber()
    @IsNotEmpty()
    readonly tonnage: number;

    @IsString()
    @IsNotEmpty()
    @IsEnum(TransportType)
    readonly type: TransportType;
}