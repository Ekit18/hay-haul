import { OtpDataType } from '@/lib/enums/otp-data-type.enum';
import { OtpType } from '@/lib/enums/otp-type.enum';
import { User } from '@/lib/types/User/User.type';
import { ValueOf } from '@/lib/types/types';
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
    resetPassword: builder.mutation<string, ResetPasswordRequestDto>({
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
    }),
    verifyOtp: builder.mutation<string, { otp: string; userData: string; dataType: string }>({
      query: (body) => ({
        body,
        url: '/auth/verify-otp',
        method: 'POST'
      })
    }),
    newOtp: builder.mutation<string, NewOtpRequestDto>({
      query: (body) => ({
        body,
        url: '/auth/new-otp',
        method: 'POST'
      })
    })
  })
});

export type NewOtpRequestDto = {
  userData: User['email'];
  dataType: ValueOf<OtpDataType>;
  type: ValueOf<OtpType>;
};

export type VerifyOtpRequestDto = Pick<NewOtpRequestDto, 'userData' | 'dataType'> & {
  otp: string;
};

export const { useNewOtpMutation } = userApi;
