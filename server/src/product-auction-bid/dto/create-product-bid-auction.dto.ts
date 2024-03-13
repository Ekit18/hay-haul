import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateProductAuctionBidDto {
  @IsNotEmpty()
  @IsNumber()
  price: number;
}
