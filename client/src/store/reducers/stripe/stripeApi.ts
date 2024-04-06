import { api } from '@/store/api';
import { TokenResponse } from '../user/userApi';

export type RecreateLinkResponseDto = {
  stripeAccountLinkUrl: string;
};

export type GetAccountStatusResponseDto = {
  payoutsEnabled: boolean;
};

export const stripeApi = api.injectEndpoints({
  endpoints: (builder) => ({
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
