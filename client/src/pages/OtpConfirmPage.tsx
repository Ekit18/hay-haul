import { AuthContainer } from '@/components/auth/AuthContainer';
import { OtpForm } from '@/components/auth/otp-check/OtpForm';

export function OtpConfirmPage() {
  return (
    <AuthContainer>
      <div className="w-10/12 lg:w-10/12 flex flex-col h-full gap-10 justify-center items-center">
        <h2 className="text-3xl font-bold text-center">Account Verification</h2>
        <div className="text-base font-medium text-center ">
          We have sent and OTP verification code to you email, please enter it here
        </div>
        <OtpForm />
      </div>
    </AuthContainer>
  );
}
