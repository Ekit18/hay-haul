import { TagType, api } from '@/store/api';
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
    paymentSuccessHook: builder.mutation<void, string>({
      query: (paymentIntentId: string) => ({
        url: '/stripe/webhook/payment_succeeded',
        method: 'POST',
        body: { payment_intent: paymentIntentId }
      }),
      invalidatesTags: [TagType.ProductAuction]
    }),
    createPayment: builder.mutation<CreatePaymentResponseDto, CreatePaymentRequestDto>({
      query: ({ auctionId }) => ({
        url: '/stripe/payment/product',
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
