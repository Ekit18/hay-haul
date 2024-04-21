import { IsString } from 'class-validator';

export class CreateDeliveryPaymentDto {
  @IsString()
  deliveryOrderId: string;
}
