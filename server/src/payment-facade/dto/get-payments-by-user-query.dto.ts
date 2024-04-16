import { IsNumber, IsOptional } from 'class-validator';

export class GetPaymentsByUserQueryDto {
  @IsNumber()
  @IsOptional()
  limit?: number;

  @IsNumber()
  @IsOptional()
  offset?: number;
}
