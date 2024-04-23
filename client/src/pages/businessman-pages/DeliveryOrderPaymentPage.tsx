import { deliveryOrderStatus } from '@/components/delivery-order/card/DeliveryOrderCardStatus.enum';
import { DeliveryOrderDestination } from '@/components/delivery-order/card/DeliveryOrderDestination';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { AppRoute } from '@/lib/constants/routes';
import { useAppSelector } from '@/lib/hooks/redux';
import { stripePromise } from '@/lib/stripe/stripePromise';
import { DeliveryOrderStatus, deliveryOrderStatusText } from '@/lib/types/DeliveryOrder/DeliveryOrder.type';
import { ProductAuctionStatus } from '@/lib/types/ProductAuction/ProductAuction.type';
import { cn } from '@/lib/utils';
import { deliveryOrderApi } from '@/store/reducers/delivery-order/deliveryOrderApi';
import { productAuctionApi } from '@/store/reducers/product-auction/productAuctionApi';
import { stripeApi } from '@/store/reducers/stripe/stripeApi';
import { QueryStatus } from '@reduxjs/toolkit/query';
import { Elements, PaymentElement, useElements, useStripe } from '@stripe/react-stripe-js';
import { StripeElementsOptions, StripeError, loadStripe } from '@stripe/stripe-js';
import { format, parseISO } from 'date-fns';
import capitalize from 'lodash.capitalize';
import { Loader2, Package } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';

export function StripeDeliveryOrderPaymentPage() {
  const [loading, setLoading] = useState(true);

  const user = useAppSelector((state) => state.user.user);

  const [getDeliveryOrder, { data: deliveryOrderWithCount, status: deliveryOrderQueryStatus }] =
    deliveryOrderApi.useLazyGetDeliveryOrderQuery();
  const deliveryOrder = deliveryOrderWithCount?.data[0];

  const [createPayment, { data: createPaymentResponse, status: createPaymentMutationStatus }] =
    stripeApi.useCreateDeliveryOrderPaymentMutation();

  const { deliveryOrderId } = useParams();

  useEffect(() => {
    if (!deliveryOrderId) {
      return;
    }
    getDeliveryOrder(deliveryOrderId);
  }, []);

  useEffect(() => {
    setLoading(
      [QueryStatus.pending, QueryStatus.uninitialized].includes(deliveryOrderQueryStatus) ||
        [QueryStatus.pending, QueryStatus.uninitialized].includes(createPaymentMutationStatus)
    );
  }, [deliveryOrderQueryStatus, createPaymentMutationStatus]);

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
      !deliveryOrder ||
      user?.id !== deliveryOrder?.userId ||
      deliveryOrder.deliveryOrderStatus !== DeliveryOrderStatus.WaitingPayment
    ) {
      return;
    }
    createPayment({ deliveryOrderId: deliveryOrder.id });
  }, [deliveryOrder?.userId, deliveryOrder?.deliveryOrderStatus, user?.id]);

  if (loading)
    return (
      <div className="flex justify-center">
        <Loader2 className="h-10 w-10 animate-spin" />
      </div>
    );
  if (!deliveryOrder || !deliveryOrderId) return <Navigate to={AppRoute.General.DeliveryOrder} replace />;
  if (user?.id !== deliveryOrder?.userId) {
    toast({
      variant: 'destructive',
      title: 'Access denied',
      description: 'Only order owner can pay for it.'
    });
    return <Navigate to={AppRoute.General.DeliveryOrder} replace />;
  }
  if (DeliveryOrderStatus.WaitingPayment !== deliveryOrder?.deliveryOrderStatus) {
    toast({
      variant: 'destructive',
      title: 'Access denied',
      description: 'You can only pay for won auctions.'
    });
    return <Navigate to={AppRoute.General.DeliveryOrder} replace />;
  }

  return (
    <div className="">
      <div className="flex flex-col gap-2">
        <div className="bg-white p-4">
          <h2 className="mb-9 mt-6 text-3xl font-bold">Payment page</h2>
        </div>
        <div className="w-full p-4">
          <div className="grid h-full w-full grid-cols-1 gap-4 min-[790px]:grid-cols-4">
            <div className="flex h-full flex-col justify-between border-b-2 text-center">
              <span className="border-b-2">Product</span>
              <div className="m-auto flex flex-col items-center gap-y-4 py-8">
                <span>
                  {capitalize(deliveryOrder?.productAuction.product.name)} by{' '}
                  {capitalize(deliveryOrder?.productAuction.product.facilityDetails.name)}
                </span>
                <div className="flex w-min flex-row gap-2 rounded border border-black p-1">
                  <Package className="min-h-5 min-w-5" />
                  <span>{deliveryOrder.productAuction.product.productType.name}</span>
                </div>
              </div>
            </div>
            {/* <div className="flex h-full flex-col justify-between border-b-2 text-center">
              <span className="border-b-2 text-center">Product order image</span>
              <img
                className="m-auto w-[200px] rounded-t-lg  object-cover min-[1068px]:h-full min-[1068px]:rounded-l-lg min-[1068px]:rounded-tr-none"
                src={deliveryOrder?.productAuction.photos[0]?.signedUrl}
                alt={deliveryOrder?.productAuction.product.name}
              />
            </div> */}
            <div className="flex h-full flex-col border-b-2 text-center">
              <span className="border-b-2">Desired delivery date</span>
              <span className="m-auto py-8 font-medium">
                {format(parseISO(deliveryOrder.desiredDate.toString()), 'yyyy-MM-dd')}
              </span>
            </div>
            <div className="flex h-full flex-col border-b-2 text-center">
              <span className="border-b-2">From / To addresses</span>
              <div className="m-auto py-8">
                <DeliveryOrderDestination
                  from={deliveryOrder.productAuction?.product.facilityDetails?.address}
                  to={deliveryOrder.facilityDetails?.address}
                />
              </div>
            </div>
            <div className="flex h-full flex-col border-b-2 text-center">
              <span className="border-b-2">Charge amount</span>
              <span className="m-auto py-8 text-2xl font-bold">{deliveryOrder?.chosenDeliveryOffer?.price} USD</span>
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
  const { deliveryOrderId } = useParams();

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
          return_url: `http://localhost:5173/delivery-order/${deliveryOrderId ?? ''}`
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
