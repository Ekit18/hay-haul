import { PickType } from '@nestjs/swagger';
import { StripeEntry } from '../stripe.entity';

export class GetAccountStatusResponseDto extends PickType(StripeEntry, [
  'payoutsEnabled',
]) {}
