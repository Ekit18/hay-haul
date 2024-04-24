import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { TransportType } from '../transport.entity';

export class UpdateTransportDto {

    @IsString()
    @IsNotEmpty()
    @IsOptional()
    readonly name: string;

    @IsString()
    @IsNotEmpty()
    @IsOptional()
    readonly licensePlate: string;

    @IsString()
    @IsNotEmpty()
    @IsEnum(TransportType)
    @IsOptional()
    readonly type: TransportType;
}