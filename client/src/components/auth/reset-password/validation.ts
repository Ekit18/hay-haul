import { AnyObject, ObjectSchema, object, ref, string } from 'yup';
import { OtpFormValues, useOtpFormSchema } from '../otp-check/validation';
import { SignInFormValues, useSignInFormSchema } from '../sign-in/validation';

export type ResetPasswordFormValues = OtpFormValues & SignInFormValues & { confirmPassword: string };

export const resetPasswordDefaultValues: ResetPasswordFormValues = {
  otpValue: '',
  email: '',
  password: '',
  confirmPassword: ''
};

export const useResetPasswordFormSchema = (): ObjectSchema<
  ResetPasswordFormValues,
  AnyObject,
  { otpValue: undefined; email: undefined; password: undefined; confirmPassword: undefined },
  ''
> => {
  return object({
    confirmPassword: string()
      .required('Confirm password is required')
      .oneOf([ref('password')], 'Passwords must match')
  }).concat(useOtpFormSchema().concat(useSignInFormSchema()));
};
