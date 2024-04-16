import { Controller, Get, Query, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import {
  DEFAULT_OFFSET,
  DEFAULT_PAGINATION_LIMIT,
} from 'src/lib/constants/constants';
import { AuthenticatedRequest } from 'src/lib/types/user.request.type';
import { GetPaymentsByUserIdResponse } from './dto/get-payments-by-user-id-response';
import { GetPaymentsByUserQueryDto } from './dto/get-payments-by-user-query.dto';
import { PaymentFacadeService } from './payment-facade.service';

@UseGuards(JwtAuthGuard)
@Controller('payment-facade')
export class PaymentFacadeController {
  constructor(private paymentFacadeService: PaymentFacadeService) {}

  @Get('payments/user')
  getAllPaymentsByUserId(
    @Query()
    {
      offset = DEFAULT_OFFSET,
      limit = DEFAULT_PAGINATION_LIMIT,
    }: GetPaymentsByUserQueryDto,
    @Req() request: AuthenticatedRequest,
  ): Promise<GetPaymentsByUserIdResponse> {
    return this.paymentFacadeService.getAllPaymentsByUserId(
      { offset, limit },
      request.user.id,
    );
  }
}
