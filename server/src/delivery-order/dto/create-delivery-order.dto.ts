import { IsDate, IsNotEmpty, IsNumber, IsPositive } from 'class-validator';

export class CreateDeliveryOrderDto {
  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  desiredPrice: number;

  @IsDate()
  @IsNotEmpty()
  desiredDate: Date;
}
