import { PaymentTargetType } from 'src/lib/enums/enums';

export class PaymentResponseDto {
  id: string;
  targetType: PaymentTargetType;
}
