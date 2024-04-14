import { IsString } from 'class-validator';

export class CreateProductPaymentDto {
  @IsString()
  auctionId: string;
}
