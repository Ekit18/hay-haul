import { Payment } from '@/lib/types/Payments/Payment';
import { api } from '@/store/api';

export type GetPaymentsByUserIdResponseDto = {
  purchases: Payment[];
  sales: Payment[];
};

export const paymentsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getPaymentsByUserId: builder.query<GetPaymentsByUserIdResponseDto, void>({
      query: () => ({
        url: '/payment-facade/payments/user'
      })
    })
  })
});
