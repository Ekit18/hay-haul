import { OtpDataType } from '@/lib/enums/otp-data-type.enum';
import { OtpType } from '@/lib/enums/otp-type.enum';
import { handleRtkError } from '@/lib/helpers/handleRtkError';
import { userApi } from '@/store/reducers/user/userApi';
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
  const [createNewOtp] = userApi.useNewOtpMutation();
  const [verifyOtp] = userApi.useVerifyOtpMutation();

  return object({
    email: string()
      .required('Email is require')
      .email('Email is invalid')
      .test({
        message: 'asdasdas',
        test: (value) => {
          console.log('sdfdsf');
          return createNewOtp({ userData: value, dataType: OtpDataType.EMAIL, type: OtpType.FORGOT_PASSWORD })
            .unwrap()
            .catch(handleRtkError)
            .then(() => {
              return true;
            })
            .catch(() => {
              return false;
            });
        }
      }),
    otpValue: string()
      .required('Otp is required')
      .length(4, 'Enter all numbers')
      .test({
        message: 'asdasdas',
        test: (value, context) => {
          console.log('asdasdasdas');
          return verifyOtp({ userData: form.getValues('email'), dataType: OtpDataType.EMAIL, otp: value })
            .unwrap()
            .catch(handleRtkError)
            .then(() => {
              return true;
            })
            .catch(() => {
              return false;
            });
        }
      }),
    password: string().required('Password is required').min(8, 'Password must be at least 8 characters long'),
    confirmPassword: string()
      .required('Confirm password is required')
      .oneOf([ref('password')], 'Passwords must match')
  });
};
