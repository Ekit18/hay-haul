import { IsEnum, IsNumber, IsString } from 'class-validator';
import { PaymentTargetType } from 'src/lib/enums/enums';

export class CreatePaymentDto {
  @IsEnum(PaymentTargetType)
  paymentTarget: PaymentTargetType;
  @IsString()
  targetId: string;
  @IsString()
  buyerId: string;
  @IsString()
  sellerId: string;
  @IsNumber()
  amount: number;
}
