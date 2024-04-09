import { api } from '@/store/api';
import { TokenResponse } from '../user/userApi';

export type RecreateLinkResponseDto = {
  stripeAccountLinkUrl: string;
};

export type GetAccountStatusResponseDto = {
  payoutsEnabled: boolean;
};

export type CreatePaymentRequestDto = {
  auctionId: string;
};

export type CreatePaymentResponseDto = {
  clientSecret: string;
};

export const stripeApi = api.injectEndpoints({
  endpoints: (builder) => ({
    createPayment: builder.mutation<CreatePaymentResponseDto, CreatePaymentRequestDto>({
      query: ({ auctionId }) => ({
        url: '/stripe/payment',
        method: 'POST',
        body: { auctionId }
      })
    }),
    recreateStripeLink: builder.mutation<RecreateLinkResponseDto, void>({
      query: () => ({
        url: '/stripe/onboarding-link/recreate',
        method: 'POST'
      })
    }),
    checkAccountStatus: builder.query<GetAccountStatusResponseDto, void>({
      query: () => ({
        url: '/stripe/account/status'
      })
    }),
    verifyStripeAccount: builder.mutation<TokenResponse, void>({
      query: () => ({
        url: '/stripe/account/verify',
        method: 'POST'
      })
    })
  })
});
