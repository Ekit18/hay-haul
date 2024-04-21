import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { TransportType } from '../transport.entity';

export class UpdateeTransportDto {

    @IsString()
    @IsNotEmpty()
    @IsOptional()
    readonly name: string;

    @IsString()
    @IsNotEmpty()
    @IsOptional()
    readonly licensePlate: string;

    @IsNumber()
    @IsNotEmpty()
    @IsOptional()
    readonly tonnage: number;

    @IsString()
    @IsNotEmpty()
    @IsEnum(TransportType)
    @IsOptional()
    readonly type: TransportType;
}