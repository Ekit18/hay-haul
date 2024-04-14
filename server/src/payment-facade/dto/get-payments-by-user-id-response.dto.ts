import { Payment } from 'src/lib/classes/payment.class';

export class GetPaymentsByUserIdResponseDto {
  purchases: Payment[];
  sales: Payment[];
}
