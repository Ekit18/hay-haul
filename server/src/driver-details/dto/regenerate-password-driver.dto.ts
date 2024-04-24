import { PickType } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { UpdateUserDto } from 'src/user/dto/update-user.dto';
import { DriverStatus } from '../driver-details.entity';

export class RegeneratePasswordDriverDto extends PickType(UpdateUserDto, [
    'password',
]) {

}