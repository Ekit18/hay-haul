import { AuthContainer } from '@/components/auth/AuthContainer';
import { ResetPasswordForm } from '@/components/auth/reset-password/ResetPasswordForm';
import { useAppDispatch } from '@/lib/hooks/redux';

export function ResetPasswordPage() {
  const dispatch = useAppDispatch();

  return (
    <AuthContainer>
      <div className="w-10/12 lg:w-10/12">
        <h2 className="text-3xl font-bold text-center">Reset password</h2>
        <ResetPasswordForm />
      </div>
    </AuthContainer>
  );
}
