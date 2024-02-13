import { OtpDataType, OtpType } from 'src/lib/enums/enums';
import { ValueOf } from 'src/lib/types/types';

export class NewOtpDto {
  type: ValueOf<OtpType>;
  userData: string;
  dataType: ValueOf<OtpDataType>;
}
