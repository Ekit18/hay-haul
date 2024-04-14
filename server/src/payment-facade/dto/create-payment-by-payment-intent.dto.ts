import { IsString } from 'class-validator';

export class CreatePaymentByPaymentIntentDto {
  @IsString()
  paymentIntent: string;
}
