import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { AppRoute } from '@/lib/constants/routes';
import { useAppSelector } from '@/lib/hooks/redux';
import { stripePromise } from '@/lib/stripe/stripePromise';
import { ProductAuctionStatus } from '@/lib/types/ProductAuction/ProductAuction.type';
import { productAuctionApi } from '@/store/reducers/product-auction/productAuctionApi';
import { stripeApi } from '@/store/reducers/stripe/stripeApi';
import { QueryStatus } from '@reduxjs/toolkit/query';
import { Elements, PaymentElement, useElements, useStripe } from '@stripe/react-stripe-js';
import { StripeElementsOptions, StripeError, loadStripe } from '@stripe/stripe-js';
import capitalize from 'lodash.capitalize';
import { Loader2 } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';

export function StripeProductAuctionPaymentPage() {
  const [loading, setLoading] = useState(true);

  const user = useAppSelector((state) => state.user.user);

  const [getProductAuction, { data: auctionWithCount, status: auctionQueryStatus }] =
    productAuctionApi.useLazyGetProductAuctionQuery();
  const auction = auctionWithCount?.data[0];

  const [createPayment, { data: createPaymentResponse, status: createPaymentMutationStatus }] =
    stripeApi.useCreateProductAuctionPaymentMutation();

  const { auctionId } = useParams();

  useEffect(() => {
    if (!auctionId) {
      return;
    }
    getProductAuction(auctionId);
  }, []);

  useEffect(() => {
    setLoading(
      [QueryStatus.pending, QueryStatus.uninitialized].includes(auctionQueryStatus) ||
        [QueryStatus.pending, QueryStatus.uninitialized].includes(createPaymentMutationStatus)
    );
  }, [auctionQueryStatus, createPaymentMutationStatus]);

  const options: StripeElementsOptions | null = useMemo(
    () =>
      createPaymentResponse?.clientSecret
        ? {
            clientSecret: createPaymentResponse?.clientSecret,
            appearance: {}
          }
        : null,
    [createPaymentResponse?.clientSecret]
  );

  useEffect(() => {
    if (
      !auction ||
      user?.id !== auction?.currentMaxBid?.userId ||
      ProductAuctionStatus.WaitingPayment !== auction.auctionStatus
    ) {
      return;
    }
    createPayment({ auctionId: auction.id });
  }, [auction?.currentMaxBid?.userId, auction?.auctionStatus, user?.id]);

  if (loading)
    return (
      <div className="flex justify-center">
        <Loader2 className="h-10 w-10 animate-spin" />
      </div>
    );
  if (!auction || !auctionId) return <Navigate to={AppRoute.General.MyAuctions} replace />;
  if (user?.id !== auction?.currentMaxBid?.userId) {
    toast({
      variant: 'destructive',
      title: 'Access denied',
      description: 'Only winner can pay for auction.'
    });
    return <Navigate to={AppRoute.General.MyAuctions} replace />;
  }
  if (ProductAuctionStatus.WaitingPayment !== auction.auctionStatus) {
    toast({
      variant: 'destructive',
      title: 'Access denied',
      description: 'You can only pay for won auctions.'
    });
    return <Navigate to={AppRoute.General.MyAuctions} replace />;
  }

  return (
    <div className="">
      <div className="flex flex-col gap-2">
        <div className="bg-white p-4">
          <h2 className="mb-9 mt-6 text-3xl font-bold">Payment page</h2>
        </div>
        <div className="w-full p-4">
          <div className="grid h-full w-full grid-cols-3 gap-4">
            <div className="flex h-full flex-col justify-between border-b-2 text-center">
              <span className="border-b-2 text-center">Auction image</span>
              <img
                className="m-auto w-[200px] rounded-t-lg  object-cover min-[1068px]:h-full min-[1068px]:rounded-l-lg min-[1068px]:rounded-tr-none"
                src={auction?.photos[0]?.signedUrl}
                alt={auction.product.name}
              />
            </div>
            <div className="flex h-full flex-col justify-between border-b-2 text-center">
              <span className="border-b-2">Auction name</span>
              <div className="m-auto">
                <span>
                  {capitalize(auction.product.name)} by {capitalize(auction.product.facilityDetails.name)}
                </span>
              </div>
            </div>
            <div className="flex h-full flex-col border-b-2 text-center">
              <span className="border-b-2">Charge amount</span>
              <span className="m-auto text-2xl font-bold">{auction.currentMaxBid?.price} USD</span>
            </div>
          </div>
        </div>
        {stripePromise !== null && options !== null && (
          <Elements stripe={stripePromise} options={options}>
            <CheckoutForm />
          </Elements>
        )}
        <div className="w-full px-4" />
      </div>
    </div>
  );
}

export function CheckoutForm() {
  const stripe = useStripe();
  const elements = useElements();

  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const navigate = useNavigate();
  const { auctionId } = useParams();

  useEffect(() => {
    if (errorMessage) {
      toast({ variant: 'destructive', title: 'Stripe error', description: errorMessage });
    }
  }, [errorMessage]);

  const handleSubmit = async (event: React.FormEvent) => {
    // We don't want to let default form submission happen here,
    // which would refresh the page.
    event.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js hasn't yet loaded.
      // Make sure to disable form submission until Stripe.js has loaded.
      return;
    }

    try {
      const { error } = await stripe.confirmPayment({
        // `Elements` instance that was used to create the Payment Element
        elements,
        confirmParams: {
          // TODO: change return_url
          // return_url: 'https://google.com'
          return_url: `http://localhost:5173/auction-details/${auctionId ?? ''}`
        }
      });

      if (error) {
        console.log('just error', error);
        // This point will only be reached if there is an immediate error when
        // confirming the payment. Show error to your customer (for example, payment
        // details incomplete)
        setErrorMessage(error?.message || null);
      } else {
        // Your customer will be redirected to your `return_url`. For some payment
        // methods like iDEAL, your customer will be redirected to an intermediate
        // site first to authorize the payment, then redirected to the `return_url`.
      }
    } catch (error) {
      console.log('real error', error);
      setErrorMessage((error as StripeError)?.message || null);
    }
  };

  return (
    <div className="px-12">
      <form onSubmit={handleSubmit}>
        <PaymentElement />
        <Button className="mt-8" type="submit">
          Submit
        </Button>
      </form>
    </div>
  );
}
