import { Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Response } from 'express';
import { AuthErrorMessage } from 'src/auth/auth-error-message.enum';
import { TokenResponse } from 'src/auth/dto/token-response.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { getSwaggerResponseDescription } from 'src/lib/helpers/getSwaggerResponseDescription';
import { AuthenticatedRequest } from 'src/lib/types/user.request.type';
import { GetAccountStatusResponseDto } from './dto/get-account-status-response.dto';
import { StripeErrorMessage } from './stripe-error-message.enum';
import { StripeService } from './stripe.service';

@UseGuards(JwtAuthGuard)
@Controller('stripe')
export class StripeController {
  constructor(private stripeService: StripeService) {}

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
  @Post('onboarding-link/recreate')
  async recreateStripeOnboardingLink(@Req() req: AuthenticatedRequest) {
    //TODO: Stopped at stripe integration here. Create stripeApi at frontend, then link refetch logic on frontend, then "Register in Stripe" page
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
  async sdf(
    @Req() req: AuthenticatedRequest,
    @Res({ passthrough: true }) res: Response,
  ): Promise<TokenResponse> {
    return await this.stripeService.verifyStripe(req, res);
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
