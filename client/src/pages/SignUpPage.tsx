import { AuthContainer } from '@/components/auth/AuthContainer';
import { SignUpForm } from '@/components/auth/sign-up/SignUpForm';

export function SignUpPage() {
  return (
    <AuthContainer>
      <div className="w-10/12 lg:w-10/12">
        <h2 className="text-3xl font-bold text-center">Sign up</h2>
        <SignUpForm />
      </div>
    </AuthContainer>
  );
}
