import { AuthContainer } from '@/components/auth/AuthContainer';
import { SignInForm } from '@/components/auth/sign-in/SignInForm';
import { Button } from '@/components/ui/button';
import { AppRoute } from '@/lib/constants/routes';
import { useNavigate } from 'react-router-dom';

export function SignInPage() {
  const navigate = useNavigate();

  return (
    <>
      <AuthContainer>
        <div className="w-10/12 lg:w-8/12">
          <h2 className="text-center text-3xl font-bold">Sign in</h2>
          <SignInForm />
          <div className="mt-6 flex flex-col gap-2 text-center">
            <Button
              onClick={() => navigate(AppRoute.General.ResetPassword)}
              variant={'link'}
              className="font-bold text-black"
            >
              Forgot password?
            </Button>
            <p>
              No account?{' '}
              <Button
                onClick={() => navigate(AppRoute.General.SignUp)}
                variant={'link'}
                className="font-bold text-black"
              >
                Create one
              </Button>
            </p>
          </div>
        </div>
      </AuthContainer>
    </>
  );
}
