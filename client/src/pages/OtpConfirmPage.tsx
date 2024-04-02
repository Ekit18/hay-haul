import { AuthContainer } from '@/components/auth/AuthContainer';
import { OtpForm } from '@/components/auth/otp-check/OtpForm';
import { OtpSuccess } from '@/components/auth/otp-check/OtpSuccess';
import { useState } from 'react';

export function OtpConfirmPage() {
  const [isSuccess, setIsSuccess] = useState(false);

  return (
    <AuthContainer>
      <div className="flex h-full w-10/12 flex-col items-center justify-center gap-10 lg:w-10/12">
        <h2 className="text-center text-3xl font-bold">Account Verification</h2>
        {isSuccess ? <OtpSuccess /> : <OtpForm onSetIsSuccess={setIsSuccess} />}
      </div>
    </AuthContainer>
  );
}
