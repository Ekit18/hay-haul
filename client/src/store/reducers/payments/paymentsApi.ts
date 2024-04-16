import { Payment } from '@/lib/types/Payments/Payment';
import { DataWithCount } from '@/lib/types/types';
import { TagType, api } from '@/store/api';

export type GetPaymentsByUserIdResponse = DataWithCount<Payment>;
export type GetPaymentsByUserQueryDto = { limit: number; offset: number };
export const paymentsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getPaymentsByUserId: builder.query<GetPaymentsByUserIdResponse, URLSearchParams>({
      query: (searchParams) => ({
        url: '/payment-facade/payments/user',
        params: searchParams
      }),
      providesTags: [TagType.Payment],
      keepUnusedDataFor: 0,
      serializeQueryArgs: ({ endpointName }) => {
        return endpointName;
      },
      merge: (currentCache, newItems, { arg }) => {
        if (arg.get('offset') !== null) {
          currentCache.data.push(...newItems.data);
        } else {
          currentCache.count = newItems.count;
          currentCache.data = newItems.data;
        }
      },
      forceRefetch({ currentArg, previousArg }) {
        return currentArg?.get('offset') !== previousArg?.get('offset');
      }
    })
  })
});
