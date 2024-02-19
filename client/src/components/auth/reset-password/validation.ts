import { AnyObject, ObjectSchema, object, ref, string } from 'yup';
import { OtpFormValues } from '../otp-check/validation';
import { SignInFormValues } from '../sign-in/validation';

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
    email: string().required('Email is require').email('Email is invalid'),
    otpValue: string().required('Otp is required').length(4, 'Enter all numbers'),
    password: string().required('Password is required').min(8, 'Password must be at least 8 characters long'),
    confirmPassword: string()
      .required('Confirm password is required')
      .oneOf([ref('password')], 'Passwords must match')
  });
};
