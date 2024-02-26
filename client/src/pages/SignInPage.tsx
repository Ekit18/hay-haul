import { AuthContainer } from '@/components/auth/AuthContainer';
import { SignInForm } from '@/components/auth/sign-in/SignInForm';
import { AppRoute } from '@/lib/constants/routes';

export function SignInPage() {
  return (
    <>
      <AuthContainer>
        <div className="w-10/12 lg:w-8/12">
          <h2 className="text-3xl font-bold text-center">Sign in</h2>
          <SignInForm />
          <div className="text-center mt-6 flex flex-col gap-2">
            <a href={AppRoute.General.ResetPassword} className="font-bold">
              Forgot password?
            </a>
            <p>
              No account?{' '}
              <a href={AppRoute.General.SignUp} className="font-bold">
                Create one
              </a>
            </p>
          </div>
        </div>
      </AuthContainer>
    </>
  );
}
