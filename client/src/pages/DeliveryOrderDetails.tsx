import { ImageCarousel } from '@/components/carousel/ImageCarousel';
import { DeliveryOfferCard } from '@/components/delivery-offer/delivery-offer-card/DeliveryOfferCard';
import { CreateDeliveryOfferForm } from '@/components/delivery-offer/modals/create-delivery-offer/CreateDeliveryOfferModal';
import { deliveryOrderStatus } from '@/components/delivery-order/card/DeliveryOrderCardStatus.enum';
import { DeliveryOrderDestination } from '@/components/delivery-order/card/DeliveryOrderDestination';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from '@/components/ui/breadcrumb';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { AppRoute } from '@/lib/constants/routes';
import { UserRole } from '@/lib/enums/user-role.enum';
import { handleRtkError } from '@/lib/helpers/handleRtkError';
import { useAppSelector } from '@/lib/hooks/redux';
import { stripePromise } from '@/lib/stripe/stripePromise';
import { DeliveryOrderStatus, deliveryOrderStatusText } from '@/lib/types/DeliveryOrder/DeliveryOrder.type';
import { cn } from '@/lib/utils';
import { deliveryOrderApi } from '@/store/reducers/delivery-order/deliveryOrderApi';
import { stripeApi } from '@/store/reducers/stripe/stripeApi';
import { Stripe } from '@stripe/stripe-js';
import { format, parseISO } from 'date-fns';
import { Crown, Loader2, Package } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { Navigate, generatePath, useNavigate, useParams, useSearchParams } from 'react-router-dom';

export function DeliveryOrderDetails() {
  const { deliveryOrderId } = useParams();

  const navigate = useNavigate();
  const user = useAppSelector((state) => state.user.user);

  const [getDeliveryOrder, { data, isFetching, isError, isLoading }] = deliveryOrderApi.useLazyGetDeliveryOrderQuery();

  useEffect(() => {
    if (!deliveryOrderId) {
      return;
    }
    getDeliveryOrder(deliveryOrderId);
  }, [deliveryOrderId]);

  const deliveryOrder = data?.data[0];

  const currentOffer = useMemo(
    () => deliveryOrder?.deliveryOffers.find((offer) => offer.userId === user?.id),
    [deliveryOrder?.deliveryOffers, user?.id]
  );

  const [hookPaymentSuccessful] = stripeApi.usePaymentSuccessHookMutation();
  const [stripe, setStripe] = useState<Stripe | null>(null);
  const [_, setSearchParams] = useSearchParams();

  useEffect(() => {
    stripePromise.then((stripe) => {
      console.log('STRPE PROMISE');
      setStripe(stripe);
    });
  }, [stripePromise]);

  useEffect(() => {
    console.log('stripe');
    console.log(stripe);
    if (!stripe) {
      return;
    }

    // Retrieve the "payment_intent_client_secret" query parameter appended to
    // your return_url by Stripe.js
    const searchParams = new URLSearchParams(window.location.search);
    const clientSecret = searchParams.get('payment_intent_client_secret');
    const paymentIntentId = searchParams.get('payment_intent');

    if (!clientSecret) {
      return;
    }

    // Retrieve the PaymentIntent
    stripe.retrievePaymentIntent(clientSecret).then(({ paymentIntent }) => {
      if (!paymentIntent) {
        return;
      }
      // Inspect the PaymentIntent `status` to indicate the status of the payment
      // to your customer.
      //
      // Some payment methods will [immediately succeed or fail][0] upon
      // confirmation, while others will first enter a `processing` state.
      //
      // [0]: https://stripe.com/docs/payments/payment-methods#payment-notification
      switch (paymentIntent.status) {
        case 'succeeded':
          if (paymentIntentId) {
            hookPaymentSuccessful(paymentIntentId)
              .unwrap()
              .catch(handleRtkError)
              .finally(() => {
                setSearchParams(() => new URLSearchParams());
              });
          }
          toast({ variant: 'success', title: 'Success! Payment received.' });
          break;

        case 'processing':
          toast({ variant: 'default', title: "Payment processing. We'll update you when payment is received." });
          break;

        case 'requires_payment_method':
          // Redirect your user back to your payment page to attempt collecting
          // payment again
          toast({ variant: 'destructive', title: 'Payment failed. Please try another payment method.' });
          navigate(`http://localhost:5173/delivery-order/payment/${deliveryOrderId ?? ''}`);
          break;

        default:
          toast({ variant: 'destructive', title: 'Something went wrong.' });
          break;
      }
    });
  }, [stripe]);

  if (isFetching || isLoading || !data) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin" />
      </div>
    );
  }

  if (!deliveryOrderId || isError || !deliveryOrder) {
    return <Navigate to={generatePath(AppRoute.General.DeliveryOrder)} />;
  }

  const handlePayClick = () => {
    if (user?.role !== UserRole.Businessman || !deliveryOrder.chosenDeliveryOffer || !deliveryOrderId) {
      return;
    }
    navigate(generatePath(AppRoute.Businessman.DeliveryOrderPaymentPage, { deliveryOrderId }));
  };

  return (
    <div className="h-full bg-white p-4">
      <div className="pt-10">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink
                className="cursor-pointer"
                onClick={() => {
                  user?.role === UserRole.Carrier
                    ? navigate(AppRoute.Carrier.DeliveryOrders)
                    : navigate(AppRoute.Businessman.Delivery);
                }}
              >
                Delivery
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>
                {deliveryOrder.productAuction?.product.name} to {deliveryOrder.facilityDetails?.name}
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      <div className="pt-10">
        <h2 className="mb-9 text-3xl font-bold">Delivery order details ({deliveryOrderId})</h2>
        <div className="flex h-full w-full flex-col items-center gap-4 xl:grid xl:grid-cols-[1fr_2fr_1fr] xl:flex-row">
          <div className="w-[500px]">
            <ImageCarousel items={deliveryOrder.productAuction.photos.map((photo) => ({ preview: photo.signedUrl }))} />
          </div>
          <div className="xl:justify-left flex w-full flex-col items-center justify-center gap-4 xl:items-start">
            <p>
              Delivery status:{' '}
              <span
                className={cn(
                  'w-max whitespace-nowrap rounded-lg px-2 py-1 text-sm',
                  deliveryOrderStatus[deliveryOrder.deliveryOrderStatus]
                )}
              >
                {deliveryOrderStatusText[deliveryOrder.deliveryOrderStatus]}
              </span>
            </p>
            <p>
              Desired delivery date:{' '}
              <span className="font-medium">
                {format(parseISO(deliveryOrder.desiredDate.toString()), 'yyyy-MM-dd')}
              </span>
            </p>
            <p>
              Desired delivery price: <span className="font-medium">{deliveryOrder.desiredPrice} USD</span>
            </p>
            <div className="mt-2 flex flex-row items-center gap-1">
              <p>Product type:</p>
              <div className=" flex w-min flex-row gap-2 rounded border border-black p-1">
                <Package className="min-h-5 min-w-5" />
                <span>{deliveryOrder.productAuction.product.productType.name}</span>
              </div>
            </div>
            <DeliveryOrderDestination
              from={deliveryOrder.productAuction?.product.facilityDetails?.address}
              to={deliveryOrder.facilityDetails?.address}
            />
          </div>
          {user?.role === UserRole.Carrier && (
            <div className="mb-8 flex h-fit w-60 flex-col items-center rounded-lg bg-gray-100 px-2 py-4">
              <div className="">
                <p className="text-center">Your current offer:</p>
                <div className="mb-6 flex flex-col items-center gap-2">
                  <h2 className=" text-center text-3xl font-bold">
                    {currentOffer ? `${currentOffer?.price} USD` : 'None'}
                  </h2>
                </div>
              </div>
              {deliveryOrder.deliveryOrderStatus === DeliveryOrderStatus.Active && (
                <div className="flex w-3/4 flex-col gap-y-3">
                  <div className="flex w-full justify-end py-5">
                    <CreateDeliveryOfferForm
                      currentPrice={currentOffer?.price}
                      deliveryOrderId={deliveryOrder.id}
                      desiredPrice={deliveryOrder.desiredPrice}
                    />
                  </div>
                </div>
              )}
              {deliveryOrder.chosenDeliveryOffer && deliveryOrder.chosenDeliveryOffer.userId === user.id && (
                <div className="flex gap-2">
                  <Crown className="text-yellow-400" />
                  <p className="">You were selected for this order</p>
                </div>
              )}
            </div>
          )}
          {user?.role === UserRole.Businessman && deliveryOrder.chosenDeliveryOffer && (
            <div className="mb-8 flex h-fit w-80 flex-col items-center rounded-lg bg-gray-100 px-2 py-4">
              <div className="">
                <p className="text-center">Your chosen offer:</p>
                <div className="mb-6 flex flex-col items-center gap-2">
                  <h2 className=" text-center text-3xl font-bold">{deliveryOrder.chosenDeliveryOffer.price} USD</h2>
                </div>
                <p>Winner:</p>
                <p className="text-xl">Carrier: {deliveryOrder.chosenDeliveryOffer.user.facilityDetails[0].name}</p>
                <p className="text-xl">
                  Carrier's Address: {deliveryOrder.chosenDeliveryOffer.user.facilityDetails[0].address}
                </p>
              </div>
              <div className="flex w-3/4 flex-col gap-y-3">
                {deliveryOrder.deliveryOrderStatus === DeliveryOrderStatus.WaitingPayment && (
                  <div className="flex w-full justify-end py-5">
                    <Button
                      className={cn('w-full', deliveryOrderStatus[deliveryOrder.deliveryOrderStatus])}
                      type="button"
                      onClick={handlePayClick}
                    >
                      Pay
                    </Button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
        <div className="mt-4">
          {deliveryOrder.deliveryOrderStatus === DeliveryOrderStatus.Active && (
            <>
              <h1 className="text-2xl font-bold">Delivery offers:</h1>
              <div className="grid w-full grid-cols-1 gap-4 py-4 pb-5 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
                {deliveryOrder.deliveryOffers.map((deliveryOffer) => (
                  <DeliveryOfferCard key={deliveryOffer.id} deliveryOffer={deliveryOffer} />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
