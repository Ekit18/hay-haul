import { AuthContainer } from '@/components/auth/AuthContainer';
import { OtpForm } from '@/components/auth/otp-check/OtpForm';
import { OtpSuccess } from '@/components/auth/otp-check/OtpSuccess';
import { useState } from 'react';

export function OtpConfirmPage() {
  const [isSuccess, setIsSuccess] = useState(false);

  return (
    <AuthContainer>
      <div className="w-10/12 lg:w-10/12 flex flex-col h-full gap-10 justify-center items-center">
        <h2 className="text-3xl font-bold text-center">Account Verification</h2>
        {isSuccess ? <OtpSuccess /> : <OtpForm onSetIsSuccess={setIsSuccess} />}
      </div>
    </AuthContainer>
  );
}
