import { IsString } from 'class-validator';
import { PaymentTargetType } from 'src/lib/enums/enums';

export class GetPaymentDto {
  @IsString()
  id: string;
  @IsString()
  targetType: PaymentTargetType;
}
