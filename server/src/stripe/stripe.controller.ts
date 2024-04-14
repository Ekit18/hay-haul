import {
  Body,
  Controller,
  Get,
  Inject,
  Post,
  Req,
  Res,
  UseGuards,
  forwardRef,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Response } from 'express';
import { AuthErrorMessage } from 'src/auth/auth-error-message.enum';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { getSwaggerResponseDescription } from 'src/lib/helpers/getSwaggerResponseDescription';
import { AuthenticatedRequest } from 'src/lib/types/user.request.type';
import { PaymentFacadeService } from 'src/payment-facade/payment-facade.service';
import { ProductAuctionErrorMessage } from 'src/product-auction/product-auction-error-message.enum';
import { CreateProductPaymentDto } from './dto/create-product-payment.dto';
import { GetAccountStatusResponseDto } from './dto/get-account-status-response.dto';
import { StripeErrorMessage } from './stripe-error-message.enum';
import { StripeService } from './stripe.service';

@UseGuards(JwtAuthGuard)
@Controller('stripe')
export class StripeController {
  constructor(
    private stripeService: StripeService,
    @Inject(forwardRef(() => PaymentFacadeService))
    private paymentFacadeService: PaymentFacadeService,
  ) {}

  @ApiOperation({
    summary: 'Endpoint for Stripe Webhook on successful payment',
  })
  @ApiCreatedResponse({
    description: 'Stripe payment record created successfully',
  })
  @Post('webhook/payment_succeeded')
  webhookPaymentSucceeded(
    @Body('payment_intent') paymentIntentId: string,
    @Req() request: AuthenticatedRequest,
  ) {
    console.log('payment_intent', paymentIntentId);
    return this.paymentFacadeService.savePaymentByIntentId(
      paymentIntentId,
      request.user.id,
    );
  }

  @ApiOperation({ summary: 'Request new Stripe link' })
  @ApiCreatedResponse({
    description: 'Stripe link has been created successfully',
  })
  @ApiBadRequestResponse({
    description: getSwaggerResponseDescription(
      StripeErrorMessage.SellerStripeEntryNotFound,
    ),
  })
  @ApiUnauthorizedResponse({
    description: getSwaggerResponseDescription(
      AuthErrorMessage.UserNotFoundInToken,
    ),
  })
  @ApiInternalServerErrorResponse({
    description: ProductAuctionErrorMessage.FailedFetchProductAuction,
  })
  @Post('onboarding-link/recreate')
  async recreateStripeOnboardingLink(@Req() req: AuthenticatedRequest) {
    return {
      stripeAccountLinkUrl: await this.stripeService.recreateLinkByRequest(req),
    };
  }

  @ApiOperation({ summary: 'Verify stripe account' })
  @ApiOkResponse({
    description: 'Verification successful',
  })
  @ApiBadRequestResponse({
    description: StripeErrorMessage.SellerStripeEntryNotFound,
  })
  @ApiUnauthorizedResponse({
    description: getSwaggerResponseDescription(
      AuthErrorMessage.UserNotFoundInToken,
    ),
  })
  @Post('account/verify')
  async verifyAccount(
    @Req() req: AuthenticatedRequest,
    @Res({ passthrough: true }) res: Response,
  ): Promise<void> {
    console.log('verifying account');
    const tokenDto = await this.stripeService.verifyStripe(req, res);
    res.json(tokenDto);
  }

  @ApiOperation({ summary: 'Create payment with intent' })
  @ApiOkResponse({
    description: 'Creation successful',
  })
  @ApiBadRequestResponse({
    description: StripeErrorMessage.SellerStripeEntryNotFound,
  })
  @ApiUnauthorizedResponse({
    description: getSwaggerResponseDescription(
      AuthErrorMessage.UserNotFoundInToken,
    ),
  })
  @ApiNotFoundResponse({
    description: ProductAuctionErrorMessage.AuctionNotFound,
  })
  @Post('payment')
  async sdf(
    @Req() request: AuthenticatedRequest,
    @Body() { auctionId }: CreateProductPaymentDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<void> {
    const tokenDto = await this.stripeService.createProductPayment({
      request,
      auctionId,
    });

    res.json(tokenDto);
  }

  @ApiOperation({ summary: 'Check stripe account verification status' })
  @ApiOkResponse({
    description: getSwaggerResponseDescription(
      'Stripe account has been verified successfully',
      'Stripe account has not been verified yet',
    ),
  })
  @ApiBadRequestResponse({
    description: StripeErrorMessage.SellerStripeEntryNotFound,
  })
  @ApiUnauthorizedResponse({
    description: getSwaggerResponseDescription(
      AuthErrorMessage.UserNotFoundInToken,
    ),
  })
  @Get('account/status')
  async checkAccountVerificationStatus(
    @Req() req: AuthenticatedRequest,
  ): Promise<GetAccountStatusResponseDto> {
    return await this.stripeService.checkAccountVerificationStatusByRequest(
      req,
    );
  }
}
