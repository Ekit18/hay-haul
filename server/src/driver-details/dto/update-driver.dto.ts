import { PickType } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { UpdateUserDto } from 'src/user/dto/update-user.dto';
import { DriverStatus } from '../driver-details.entity';

export class UpdateDriverDto extends PickType(UpdateUserDto, [
    'email',
    'fullName',
]) {
    @IsString()
    @IsOptional()
    @IsNotEmpty()
    readonly licenseId: string;

    @IsNumber()
    @IsOptional()
    @IsNotEmpty()
    readonly yearsOfExperience: number;

    @IsString()
    @IsOptional()
    @IsNotEmpty()
    @IsEnum(DriverStatus)
    readonly driverStatus: string;
}