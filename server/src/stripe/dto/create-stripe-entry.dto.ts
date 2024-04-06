import { PickType } from '@nestjs/swagger';
import { StripeEntry } from '../stripe.entity';

export class CreateStripeEntryDto extends PickType(StripeEntry, [
  'userId',
  'accountId',
  'linkUrl',
  'linkExpiresAt',
]) {}
