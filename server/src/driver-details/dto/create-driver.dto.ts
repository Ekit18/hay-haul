import { PickType } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsNumber } from 'class-validator';
import { RegisterUserDto } from 'src/user/dto/register-user.dto';

export class CreateDriverDto extends PickType(RegisterUserDto, [
    'email',
    'password',
    'fullName',
]) {
    @IsString()
    @IsNotEmpty()
    readonly licenseId: string;

    @IsNumber()
    @IsNotEmpty()
    readonly yearsOfExperience: number;
}