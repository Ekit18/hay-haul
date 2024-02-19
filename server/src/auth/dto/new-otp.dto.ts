import { IsEnum, IsNotEmpty, IsString, ValidateIf } from 'class-validator';
import { OtpType } from 'src/lib/enums/enums';
import { ValueOf } from 'src/lib/types/types';

export class NewOtpDto {
  @IsString()
  @IsNotEmpty()
  @IsEnum(OtpType)
  type: ValueOf<OtpType>;

  @ValidateIf(
    (o: { type: ValueOf<OtpType> }) => o.type === OtpType.FORGOT_PASSWORD,
  )
  @IsString()
  @IsNotEmpty()
  email?: string;

  @ValidateIf((o: { type: ValueOf<OtpType> }) => o.type === OtpType.REGISTER)
  @IsString()
  @IsNotEmpty()
  userId?: string;
}
