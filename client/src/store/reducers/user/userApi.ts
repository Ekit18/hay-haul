import { User } from '@/lib/types/User/User.type';
import { api } from '@/store/api';

export interface TokenResponse {
  accessToken: string;
}

export type SignRequest = Pick<User, 'email'> & {
  password: string;
};

type ResetPasswordConfirmRequest = TokenResponse & {
  password: string;
};

export const userApi = api.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<TokenResponse, SignRequest>({
      query: (body) => ({
        body,
        url: '/auth/login',
        method: 'POST'
      })
    }),
    registration: builder.mutation<TokenResponse, SignRequest>({
      query: (body) => ({
        body,
        url: '/auth/registration',
        method: 'POST'
      })
    }),
    resetPassword: builder.mutation<string, Pick<User, 'email'>>({
      query: (body) => ({
        body,
        url: '/auth/reset-password',
        method: 'POST'
      })
    }),
    validateResetPasswordToken: builder.query<string, { token: string }>({
      query: ({ token }) => ({
        url: `/auth/reset-password?token=${token}`
      })
    }),
    resetPasswordConfirm: builder.mutation<string, ResetPasswordConfirmRequest>({
      query: (body) => ({
        body,
        url: `/auth/reset-password/confirm`,
        method: 'POST'
      })
    })
  })
});
