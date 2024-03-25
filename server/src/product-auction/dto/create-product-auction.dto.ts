import { IsDate, IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';
import { ScalarComparer } from 'src/lib/class-validators/scalar-comparer';
import { ComparisonOperator } from 'src/lib/enums/enums';

export class CreateProductAuctionDto {
  @Min(0, { message: 'Start price must be greater than 0' })
  @IsNumber()
  @IsNotEmpty()
  startPrice: number;

  @ScalarComparer<CreateProductAuctionDto>('startPrice', {
    operator: ComparisonOperator.GREATER_THAN,
    message: 'Buyout price must be greater than start price',
  })
  @Min(0, { message: 'Buyout price must be greater than 0' })
  @IsNumber()
  @IsNotEmpty()
  buyoutPrice: number;

  // todo check dates compatability if start date is in future and end date is in past
  @IsDate()
  @IsNotEmpty()
  startDate: Date;

  @IsDate()
  @ScalarComparer<CreateProductAuctionDto>('startDate', {
    operator: ComparisonOperator.GREATER_THAN,
    message: 'End date must be greater than start date',
  })
  @IsNotEmpty()
  endDate: Date;

  @ScalarComparer<CreateProductAuctionDto>('endDate', {
    operator: ComparisonOperator.GREATER_THAN,
    message: 'Payment period must be greater than end date',
  })
  @IsDate()
  @IsNotEmpty()
  paymentPeriod: Date;

  @Min(0, { message: 'Bid step must be greater than 0' })
  @IsNumber()
  @IsNotEmpty()
  bidStep: number;

  @IsNotEmpty()
  @IsString()
  description: string;
}
