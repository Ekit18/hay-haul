import { ValueOf } from 'src/lib/types/types';
import { OtpType } from '../otp.entity';

export class NewOtpDto {
  type: ValueOf<OtpType>;
  userData: string;
  dataType: ValueOf<NewOtpDataType>;
}

export enum NewOtpDataType {
  EMAIL = 'email',
  USER_ID = 'userId',
}
