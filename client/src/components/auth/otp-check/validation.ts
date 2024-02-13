import { AnyObject, ObjectSchema, object, string } from 'yup';

export type OtpFormValues = {
  otpValue: string;
};

export const otpDefaultValues: OtpFormValues = {
  otpValue: ''
};

export const useOtpFormSchema = (): ObjectSchema<OtpFormValues, AnyObject, { otpValue: undefined }, ''> => {
  return object({
    otpValue: string().required('Otp is required').length(4, 'Enter all numbers')
  });
};
