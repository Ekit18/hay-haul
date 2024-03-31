import { OtpType } from '@/lib/enums/otp-type.enum';
import { User } from '@/lib/types/User/User.type';
import { ValueOf } from '@/lib/types/types';
import { api } from '@/store/api';

export interface TokenResponse {
  accessToken: string;
}

export interface CheckUserEmailResponse {
  userExist: boolean;
}

export type SignRequest = Pick<User, 'email'> & {
  password: string;
};

export type NewOtpRequestDto = {
  userId?: string;
  email?: string;
  type: ValueOf<OtpType>;
};

export type ConfirmResetPasswordDto = {
  type: ValueOf<OtpType>;
  email: string;
  password: string;
  otp: string;
};

export type VerifyOtpRequestDto = Pick<NewOtpRequestDto, 'userId' | 'email'> & {
  otp: string;
  type: ValueOf<OtpType>;
};

export type ResetPasswordDto = Pick<User, 'email'> & {
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
    resetPassword: builder.mutation<string, ResetPasswordDto>({
      query: (body) => ({
        body,
        url: '/auth/reset-password',
        method: 'POST'
      })
    }),
    validateResetPasswordToken: builder.mutation<string, { token: string }>({
      query: (body) => ({
        method: 'POST',
        body,
        url: `/auth/verify-otp`
      })
    }),
    verifyOtp: builder.mutation<TokenResponse | undefined, VerifyOtpRequestDto>({
      query: (body) => ({
        body,
        url: '/auth/verify-otp',
        method: 'POST'
      })
    }),
    newOtp: builder.mutation<string, NewOtpRequestDto>({
      query: (body) => ({
        body,
        url: '/auth/renew-otp',
        method: 'POST'
      })
    }),
    requestResetPassword: builder.mutation<undefined, NewOtpRequestDto>({
      query: (body) => ({
        body,
        url: '/auth/request-reset-password',
        method: 'POST'
      })
    }),
    checkUserEmail: builder.mutation<CheckUserEmailResponse, Pick<User, 'email'>>({
      query: (body) => ({
        body,
        url: '/auth/check-email',
        method: 'POST'
      })
    }),
    confirmResetPassword: builder.mutation<undefined, ConfirmResetPasswordDto>({
      query: (body) => ({
        body,
        url: '/auth/confirm-reset-password',
        method: 'POST'
      })
    }),
    refresh: builder.mutation<TokenResponse, undefined>({
      query: () => ({
        url: '/auth/refresh',
        method: 'POST'
      })
    })
  })
});
