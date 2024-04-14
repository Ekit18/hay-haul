import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { AuthenticatedRequest } from 'src/lib/types/user.request.type';
import { GetPaymentsByUserIdResponseDto } from './dto/get-payments-by-user-id-response.dto';
import { PaymentFacadeService } from './payment-facade.service';

@UseGuards(JwtAuthGuard)
@Controller('payment-facade')
export class PaymentFacadeController {
  constructor(private paymentFacadeService: PaymentFacadeService) {}

  @Get('payments/user')
  getAllPaymentsByUserId(
    @Req() request: AuthenticatedRequest,
  ): Promise<GetPaymentsByUserIdResponseDto> {
    return this.paymentFacadeService.getAllPaymentsByUserId(request.user.id);
  }
}
