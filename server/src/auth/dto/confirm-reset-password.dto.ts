import { IntersectionType, PickType } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { OtpType } from 'src/lib/enums/enums';
import { ValueOf } from 'src/lib/types/types';
import { RegisterUserDto } from 'src/user/dto/register-user.dto';
import { SendOtpDto } from './send-otp.dto';

export class ConfirmResetPasswordDto extends IntersectionType(
  PickType(RegisterUserDto, ['password']),
  PickType(SendOtpDto, ['otp']),
) {
  @IsString()
  @IsNotEmpty()
  @IsEnum(OtpType)
  type: ValueOf<OtpType>;

  @IsString()
  @IsNotEmpty()
  email: string;
}
