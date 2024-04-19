import { AppRoute } from '@/lib/constants/routes';
import { stripeApi } from '@/store/reducers/stripe/stripeApi';
import { useNavigate } from 'react-router-dom';
// eslint-disable-next-line camelcase
import { AuthContainer } from '@/components/auth/AuthContainer';
import { toast } from '@/components/ui/use-toast';
import { handleRtkError } from '@/lib/helpers/handleRtkError';
import { useAppDispatch } from '@/lib/hooks/redux';
import { User } from '@/lib/types/User/User.type';
import { cn } from '@/lib/utils';
import { setAccessToken } from '@/store/reducers/token/tokenSlice';
import { setUser } from '@/store/reducers/user/userSlice';
import jwt_decode from 'jwt-decode';
import { Loader2 } from 'lucide-react';
import { useEffect } from 'react';
// TODO: make return page. Add it to routing, It must check stripeApi.checkStatus, then call stripeApi.verify if OK or navigate to StripeRegisterPage if not OK and display toast for error message
export function StripeReturnPage() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [verifyAccount] = stripeApi.useVerifyStripeAccountMutation();
  const { data: stripeStatus, status: requestStatus } = stripeApi.useCheckAccountStatusQuery();
  useEffect(() => {
    if (stripeStatus?.payoutsEnabled === false) {
      toast({
        variant: 'destructive',
        title: 'Stripe error',
        description: 'Registration was not successful. Please, try again.'
      });
      navigate(AppRoute.General.StripeRegister);
      return;
    }
    verifyAccount()
      .unwrap()
      .then((data) => {
        if (!data) return;
        const { accessToken } = data;
        const user = jwt_decode<User>(accessToken);

        dispatch(setUser(user));

        dispatch(setAccessToken(accessToken));
        navigate(AppRoute.General.Main);
      })
      .catch(handleRtkError);
  }, [stripeStatus?.payoutsEnabled]);
  return (
    <AuthContainer>
      <div className="flex h-full w-10/12 flex-col items-center justify-center gap-10 lg:w-10/12">
        <h2 className="text-center text-3xl font-bold">Stripe registration</h2>
        <Loader2 className={cn('mr-2 hidden h-4 w-4 animate-spin')} /> <span>Loading...</span>
      </div>
    </AuthContainer>
  );
}
