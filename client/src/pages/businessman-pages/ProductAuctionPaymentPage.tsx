import { stripePromise } from '@/App';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { AppRoute } from '@/lib/constants/routes';
import { useAppSelector } from '@/lib/hooks/redux';
import { ProductAuctionStatus } from '@/lib/types/ProductAuction/ProductAuction.type';
import { productAuctionApi } from '@/store/reducers/product-auction/productAuctionApi';
import { stripeApi } from '@/store/reducers/stripe/stripeApi';
import { QueryStatus } from '@reduxjs/toolkit/query';
import { Elements, PaymentElement, useElements, useStripe } from '@stripe/react-stripe-js';
import { StripeElementsOptions } from '@stripe/stripe-js';
import { Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Navigate, useParams } from 'react-router-dom';

export function StripeProductAuctionPaymentPage() {
  const [loading, setLoading] = useState(true);

  const user = useAppSelector((state) => state.user.user);

  const [getProductAuction, { data: auctionWithCount, status: auctionQueryStatus }] =
    productAuctionApi.useLazyGetProductAuctionQuery();
  const auction = auctionWithCount?.data[0];

  const [createPayment, { data: createPaymentResponse, status: createPaymentMutationStatus }] =
    stripeApi.useCreatePaymentMutation();

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

  console.log(
    'user?.stripeAccountId, import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY',
    auction?.product.facilityDetails.user?.id,
    import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY
  );

  const options: StripeElementsOptions | null = createPaymentResponse?.clientSecret
    ? {
        clientSecret: createPaymentResponse?.clientSecret,
        appearance: {}
      }
    : null;

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
        {stripePromise !== null && options !== null && (
          <Elements stripe={stripePromise} options={options}>
            <CheckoutForm />
          </Elements>
        )}
        <div className="w-full px-4"></div>
      </div>
    </div>
  );
}

export function CheckoutForm() {
  const stripe = useStripe();
  const elements = useElements();

  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!stripe) {
      return;
    }

    // Retrieve the "payment_intent_client_secret" query parameter appended to
    // your return_url by Stripe.js
    const clientSecret = new URLSearchParams(window.location.search).get('payment_intent_client_secret');

    // Retrieve the PaymentIntent
    stripe.retrievePaymentIntent(clientSecret).then(({ paymentIntent }) => {
      // Inspect the PaymentIntent `status` to indicate the status of the payment
      // to your customer.
      //
      // Some payment methods will [immediately succeed or fail][0] upon
      // confirmation, while others will first enter a `processing` state.
      //
      // [0]: https://stripe.com/docs/payments/payment-methods#payment-notification
      switch (paymentIntent.status) {
        case 'succeeded':
          setMessage('Success! Payment received.');
          break;

        case 'processing':
          setMessage("Payment processing. We'll update you when payment is received.");
          break;

        case 'requires_payment_method':
          // Redirect your user back to your payment page to attempt collecting
          // payment again
          setMessage('Payment failed. Please try another payment method.');
          break;

        default:
          setMessage('Something went wrong.');
          break;
      }
    });
  }, [stripe]);

  const handleSubmit = async (event) => {
    // We don't want to let default form submission happen here,
    // which would refresh the page.
    event.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js hasn't yet loaded.
      // Make sure to disable form submission until Stripe.js has loaded.
      return;
    }

    const { error } = await stripe.confirmPayment({
      //`Elements` instance that was used to create the Payment Element
      elements,
      confirmParams: {
        //TODO: change return_url
        return_url: 'localhost:5173/product-auction/payment-completed'
      }
    });

    if (error) {
      // This point will only be reached if there is an immediate error when
      // confirming the payment. Show error to your customer (for example, payment
      // details incomplete)
      setErrorMessage(error?.message || null);
    } else {
      // Your customer will be redirected to your `return_url`. For some payment
      // methods like iDEAL, your customer will be redirected to an intermediate
      // site first to authorize the payment, then redirected to the `return_url`.
    }
  };

  return (
    <form>
      <PaymentElement />
      <Button>Submit</Button>
    </form>
  );
}
