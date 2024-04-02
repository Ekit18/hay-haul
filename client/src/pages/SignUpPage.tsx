import { AuthContainer } from '@/components/auth/AuthContainer';
import { SignUpForm } from '@/components/auth/sign-up/SignUpForm';

export function SignUpPage() {
  return (
    <AuthContainer>
      <div className="w-10/12 lg:w-10/12">
        <h2 className="text-center text-3xl font-bold">Sign up</h2>
        <SignUpForm />
      </div>
    </AuthContainer>
  );
}
