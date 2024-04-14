import { IsNotEmpty, IsNumber, IsPositive } from 'class-validator';

export class CreateDeliveryOfferDto {
  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  price: number;
}
