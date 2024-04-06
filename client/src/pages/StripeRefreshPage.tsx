import { AuthContainer } from '@/components/auth/AuthContainer';
import { cn } from '@/lib/utils';
import { stripeApi } from '@/store/reducers/stripe/stripeApi';
import { QueryStatus } from '@reduxjs/toolkit/query';
import { Loader2 } from 'lucide-react';
import { useEffect } from 'react';
import { Button } from 'react-day-picker';
import { useNavigate } from 'react-router-dom';

export function StripeRefreshPage() {
  const navigate = useNavigate();
  const [recreateLink, { data: stripeLink, status, isError: isDisabled }] = stripeApi.useRecreateStripeLinkMutation();
  const handleClick = () => {
    if (!stripeLink) {
      return;
    }
    navigate(stripeLink.stripeAccountLinkUrl);
  };
  useEffect(() => {
    recreateLink();
  });
  const isLoading = status === QueryStatus.pending || status === QueryStatus.uninitialized;

  return (
    <AuthContainer>
      <div className="flex h-full w-10/12 flex-col items-center justify-center gap-10 lg:w-10/12">
        <h2 className="text-center text-3xl font-bold">Stripe registration</h2>
        <p>Stripe account is needed to accept payments. Please, register via button below.</p>
        <Button onClick={handleClick} disabled={isLoading || isDisabled}>
          {isLoading ? (
            <>
              <Loader2 className={cn('mr-2 hidden h-4 w-4 animate-spin')} /> <span>Loading...</span>
            </>
          ) : (
            'Register'
          )}
        </Button>
      </div>
    </AuthContainer>
  );
}
