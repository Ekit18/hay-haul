import { AuthContainer } from '@/components/auth/AuthContainer';
import { Stepper } from '@/components/stepper/stepper';

export function SignUpPage() {
  return (
    <AuthContainer>
      <div className="w-10/12 lg:w-8/12">
        <h2 className="text-3xl font-bold text-center">Sign in</h2>
        <Stepper />
      </div>
    </AuthContainer>
  );
}
