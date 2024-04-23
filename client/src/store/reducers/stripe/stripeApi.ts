import { TagType, api } from '@/store/api';
import { TokenResponse } from '../user/userApi';

export type RecreateLinkResponseDto = {
  stripeAccountLinkUrl: string;
};

export type GetAccountStatusResponseDto = {
  payoutsEnabled: boolean;
};

export type CreateProductAuctionPaymentRequestDto = {
  auctionId: string;
};

export type CreateDeliveryOrderPaymentRequestDto = {
  deliveryOrderId: string;
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
    createProductAuctionPayment: builder.mutation<CreatePaymentResponseDto, CreateProductAuctionPaymentRequestDto>({
      query: ({ auctionId }) => ({
        url: '/stripe/payment/product',
        method: 'POST',
        body: { auctionId }
      })
    }),
    createDeliveryOrderPayment: builder.mutation<CreatePaymentResponseDto, CreateDeliveryOrderPaymentRequestDto>({
      query: ({ deliveryOrderId }) => ({
        url: '/stripe/payment/delivery',
        method: 'POST',
        body: { deliveryOrderId }
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
