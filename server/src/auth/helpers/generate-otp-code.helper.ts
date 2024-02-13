import {
  FOUR_DIGIT_HIGHEST_OTP,
  SMALLEST_FOUR_DIGIT_OTP,
} from '../constants/otp-code.constants';

export const generateOtpCode = (): string => {
  const fourDigitOtpCode = (
    Math.floor(Math.random() * FOUR_DIGIT_HIGHEST_OTP) + SMALLEST_FOUR_DIGIT_OTP
  ).toString();

  return fourDigitOtpCode;
};
