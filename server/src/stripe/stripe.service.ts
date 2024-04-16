import {
  BadRequestException,
  Inject,
  Injectable,
  UnauthorizedException,
  forwardRef,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Request, Response } from 'express';
import { AuthErrorMessage } from 'src/auth/auth-error-message.enum';
import { TokenResponse } from 'src/auth/dto/token-response.dto';
import { getCookieExpireDate } from 'src/auth/helpers/get-cookie-expire-date';
import { PaymentTargetType } from 'src/lib/enums/enums';
import { AuthenticatedRequest } from 'src/lib/types/user.request.type';
import { ProductAuctionPaymentService } from 'src/product-auction-payment/product-auction-payment.service';
import { ProductAuction } from 'src/product-auction/product-auction.entity';
import { ProductAuctionService } from 'src/product-auction/product-auction.service';
import { TokenService } from 'src/token/token.service';
import { UserService } from 'src/user/user.service';
import Stripe from 'stripe';
import { Repository } from 'typeorm';
import { CreateStripeEntryDto } from './dto/create-stripe-entry.dto';
import { GetAccountStatusResponseDto } from './dto/get-account-status-response.dto';
import { StripeErrorMessage } from './stripe-error-message.enum';
import { PaymentIntentMetadata, StripeEntry } from './stripe.entity';

@Injectable()
export class StripeService {
  private static FEE_PERCENT = 0.15;
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
    private productAuctionService: ProductAuctionService,
    @Inject(forwardRef(() => ProductAuctionPaymentService))
    private productAuctionPaymentService: ProductAuctionPaymentService,
  ) {
    this.stripe = new Stripe(configService.getOrThrow('STRIPE_SECRET_KEY'));
  }

  public async getPaymentIntentById(
    id: string,
  ): Promise<Stripe.Response<Stripe.PaymentIntent>> {
    return await this.stripe.paymentIntents.retrieve(id);
  }

  public async createProductPayment({
    request,
    auctionId,
  }: {
    request: AuthenticatedRequest;
    auctionId: ProductAuction['id'];
  }) {
    const {
      data: [auction],
    } = await this.productAuctionService.findOneById(auctionId);

    const stripeEntry = await this.findOneByUserId(
      auction.product.facilityDetails.user.id,
    );

    const payment = await this.productAuctionPaymentService.create({
      targetId: auction.id,
      paymentTarget: PaymentTargetType.ProductAuction,
      buyerId: request.user?.id,
      sellerId: auction.product.facilityDetails.user.id,
      amount: auction.currentMaxBid.price,
    });

    const paymentIntentMetadata: Record<keyof PaymentIntentMetadata, string> = {
      paymentId: payment.id,
      paymentTargetType: payment.targetType,
    };
    const { client_secret: clientSecret } =
      await this.stripe.paymentIntents.create({
        amount: auction.currentMaxBid.price * 100,
        currency: 'usd',
        metadata: paymentIntentMetadata,
        description: auction.product.name,
        automatic_payment_methods: {
          enabled: true,
        },
        receipt_email: 'fieldlavender70@gmail.com',
        transfer_data: {
          destination: stripeEntry.accountId,
        },
        application_fee_amount: Number.parseInt(
          (
            StripeService.FEE_PERCENT *
            auction.currentMaxBid.price *
            100
          ).toFixed(0),
        ),
      });

    return { clientSecret };
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

  private wait(ms) {
    return new Promise((res) => setTimeout(res, ms));
  }

  public async checkAccountVerificationStatusByRequest(
    request: AuthenticatedRequest,
  ): Promise<GetAccountStatusResponseDto> {
    const stripeEntry = await this.findOneByRequest(request);

    return async function check(this: StripeService) {
      let depth = 0;

      const { payouts_enabled: payoutsEnabled } =
        await this.stripe.accounts.retrieve(stripeEntry.accountId);
      console.log('payoutsEnabled check: %s', payoutsEnabled);
      if (payoutsEnabled) {
        return { payoutsEnabled };
      }
      if (depth <= 2) {
        await this.wait(2 ** depth++ * 3000);
        return check.apply(this);
      }
    }.apply(this);
  }

  public async verifyStripe(
    request: AuthenticatedRequest,
    response: Response,
  ): Promise<TokenResponse> {
    const stripeEntry = await this.findOneByRequest(request);
    if (!stripeEntry.payoutsEnabled) {
      const { payoutsEnabled } =
        await this.checkAccountVerificationStatusByRequest(request);
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
