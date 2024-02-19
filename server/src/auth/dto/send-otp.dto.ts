import { PickType } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Length } from 'class-validator';
import { NewOtpDto } from './new-otp.dto';

export class SendOtpDto extends PickType(NewOtpDto, [
  'type',
  'email',
  'userId',
]) {
  @IsString()
  @IsNotEmpty()
  @Length(4, 4)
  otp: string;
}
