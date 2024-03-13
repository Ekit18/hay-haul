import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateProductAuctionDto {
  @IsNumber()
  // @Min(0)
  @IsNotEmpty()
  startPrice: number;
  @IsNumber()
  @IsNotEmpty()
  buyoutPrice: number;
  @IsNotEmpty()
  startDate: Date;
  @IsNotEmpty()
  endDate: Date;
  @IsNotEmpty()
  paymentPeriod: Date;
  @IsNumber()
  @IsNotEmpty()
  bidStep: number;
}
