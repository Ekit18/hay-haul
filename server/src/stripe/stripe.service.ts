import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Request, Response } from 'express';
import { AuthErrorMessage } from 'src/auth/auth-error-message.enum';
import { TokenResponse } from 'src/auth/dto/token-response.dto';
import { getCookieExpireDate } from 'src/auth/helpers/get-cookie-expire-date';
import { AuthenticatedRequest } from 'src/lib/types/user.request.type';
import { TokenService } from 'src/token/token.service';
import { UserService } from 'src/user/user.service';
import Stripe from 'stripe';
import { Repository } from 'typeorm';
import { CreateStripeEntryDto } from './dto/create-stripe-entry.dto';
import { GetAccountStatusResponseDto } from './dto/get-account-status-response.dto';
import { StripeErrorMessage } from './stripe-error-message.enum';
import { StripeEntry } from './stripe.entity';

@Injectable()
export class StripeService {
  private stripe: Stripe;
  private readonly jwtRefreshTokenExpire = this.configService.get<string>(
    'JWT_REFRESH_TOKEN_EXPIRE',
  );
  constructor(
    @InjectRepository(StripeEntry)
    private stripeEntryRepository: Repository<StripeEntry>,
    private configService: ConfigService,
    private tokenService: TokenService,
    private userService: UserService,
  ) {
    this.stripe = new Stripe(configService.getOrThrow('STRIPE_SECRET_KEY'));
  }

  public createAccount({
    params,
    options,
  }: {
    params: Stripe.AccountCreateParams;
    options?: Stripe.RequestOptions;
  }): Promise<Stripe.Response<Stripe.Account>> {
    return this.stripe.accounts.create(params, options);
  }

  public linkAccount({
    params,
    options,
  }: {
    params: Stripe.AccountLinkCreateParams;
    options?: Stripe.RequestOptions;
  }): Promise<Stripe.Response<Stripe.AccountLink>> {
    return this.stripe.accountLinks.create(params, options);
  }

  public createEntry({
    userId,
    accountId,
    linkExpiresAt,
    linkUrl,
  }: CreateStripeEntryDto): Promise<StripeEntry> {
    return this.stripeEntryRepository.save({
      userId,
      accountId,
      linkExpiresAt,
      linkUrl,
    });
  }

  public findOneByUserId(
    userId: StripeEntry['userId'],
  ): Promise<StripeEntry | null> {
    return this.stripeEntryRepository.findOneBy({ userId });
  }

  public async recreateLinkByRequest(
    request: AuthenticatedRequest,
  ): Promise<string> {
    const userId = request.user?.id;
    if (!userId) {
      throw new UnauthorizedException({
        message: AuthErrorMessage.UserNotFoundInToken,
      });
    }
    const stripeEntry = await this.findOneByUserId(userId);

    if (!stripeEntry) {
      throw new BadRequestException({
        message: StripeErrorMessage.SellerStripeEntryNotFound,
      });
    }

    const newLink = await this.linkAccount({
      params: {
        account: stripeEntry.accountId,
        return_url: `${request.headers.origin}/stripe/return`,
        refresh_url: `${request.headers.origin}/stripe/refresh`,
        type: 'account_onboarding',
      },
    });

    await this.stripeEntryRepository.save({
      id: stripeEntry.id,
      linkExpiresAt: new Date(newLink.expires_at * 1000),
      linkUrl: newLink.url,
    });

    return newLink.url;
  }

  public async recreateLinkByUserId(
    userId: StripeEntry['userId'],
    request: Request,
  ): Promise<StripeEntry> {
    const stripeEntry = await this.findOneByUserId(userId);

    if (!stripeEntry) {
      throw new BadRequestException({
        message: StripeErrorMessage.SellerStripeEntryNotFound,
      });
    }

    const newLink = await this.linkAccount({
      params: {
        account: stripeEntry.accountId,
        return_url: `${request.headers.origin}/return`,
        refresh_url: `${request.headers.origin}/refresh`,
        type: 'account_onboarding',
      },
    });

    return await this.stripeEntryRepository.save({
      id: stripeEntry.id,
      linkExpiresAt: new Date(newLink.expires_at * 1000),
      linkUrl: newLink.url,
    });
  }

  public async findOneByRequest(
    request: AuthenticatedRequest,
  ): Promise<StripeEntry> {
    const userId = request.user?.id;
    if (!userId) {
      throw new UnauthorizedException({
        message: AuthErrorMessage.UserNotFoundInToken,
      });
    }
    const stripeEntry = await this.findOneByUserId(userId);

    if (!stripeEntry) {
      throw new BadRequestException({
        message: StripeErrorMessage.SellerStripeEntryNotFound,
      });
    }
    return stripeEntry;
  }

  public async checkAccountVerificationStatusByRequest(
    request: AuthenticatedRequest,
  ): Promise<GetAccountStatusResponseDto> {
    const stripeEntry = await this.findOneByRequest(request);

    const { payouts_enabled: payoutsEnabled } =
      await this.stripe.accounts.retrieve(stripeEntry.accountId);
    return { payoutsEnabled };
  }

  public async verifyStripe(
    request: AuthenticatedRequest,
    response: Response,
  ): Promise<TokenResponse> {
    const stripeEntry = await this.findOneByRequest(request);
    if (!stripeEntry.payoutsEnabled) {
      const { payouts_enabled: payoutsEnabled } =
        await this.stripe.accounts.retrieve(stripeEntry.accountId);
      if (!payoutsEnabled) {
        throw new BadRequestException({
          message: StripeErrorMessage.AccountNotVerifiedYet,
        });
      }
      await this.stripeEntryRepository.save({
        id: stripeEntry.id,
        payoutsEnabled,
      });
    }
    const user = await this.userService.getUserById(request.user.id);

    const newTokens = await this.tokenService.generateTokens(user);

    response.cookie('refreshToken', newTokens.refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      expires: getCookieExpireDate(this.jwtRefreshTokenExpire),
    });

    console.log('stripe verify new tokens', newTokens);

    return { accessToken: newTokens.accessToken };
  }
}
