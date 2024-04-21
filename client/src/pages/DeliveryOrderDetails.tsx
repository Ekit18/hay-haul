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
import { AppRoute } from '@/lib/constants/routes';
import { UserRole } from '@/lib/enums/user-role.enum';
import { useAppSelector } from '@/lib/hooks/redux';
import { DeliveryOrderStatus, deliveryOrderStatusText } from '@/lib/types/DeliveryOrder/DeliveryOrder.type';
import { cn } from '@/lib/utils';
import { deliveryOrderApi } from '@/store/reducers/delivery-order/deliveryOrderApi';
import { format, parseISO } from 'date-fns';
import { Loader2, Package } from 'lucide-react';
import { useEffect, useMemo } from 'react';
import { Navigate, generatePath, useNavigate, useParams } from 'react-router-dom';

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
    if (user?.role !== UserRole.Businessman || !deliveryOrder.chosenDeliveryOffer) {
      return;
    }
    navigate(generatePath(AppRoute.General.Main));
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
            <div className="flex h-fit w-60 flex-col items-center rounded-lg bg-gray-100 px-2 py-4">
              <div className="">
                <p className="text-center">Your current offer:</p>
                <div className="mb-6 flex flex-col items-center gap-2">
                  <h2 className=" text-center text-3xl font-bold">
                    {currentOffer ? `${currentOffer?.price} USD` : 'None'}
                  </h2>
                </div>
              </div>
              <div className="flex w-3/4 flex-col gap-y-3">
                <div className="flex w-full justify-end py-5">
                  <CreateDeliveryOfferForm
                    currentPrice={currentOffer?.price}
                    deliveryOrderId={deliveryOrder.id}
                    desiredPrice={deliveryOrder.desiredPrice}
                  />
                </div>
              </div>
            </div>
          )}
          {user?.role === UserRole.Businessman && deliveryOrder.chosenDeliveryOffer && (
            <div className="flex h-fit w-80 flex-col items-center rounded-lg bg-gray-100 px-2 py-4">
              <div className="">
                <p className="text-center">Your chosen offer:</p>
                <div className="mb-6 flex flex-col items-center gap-2">
                  <h2 className=" text-center text-3xl font-bold">{deliveryOrder.chosenDeliveryOffer.price} USD</h2>
                </div>
                <p className="text-xl">Carrier: {deliveryOrder.chosenDeliveryOffer.user.facilityDetails[0].name}</p>
                <p className="text-xl">
                  Carrier's Address: {deliveryOrder.chosenDeliveryOffer.user.facilityDetails[0].address}
                </p>
              </div>
              <div className="flex w-3/4 flex-col gap-y-3">
                {
                  <div className="flex w-full justify-end py-5">
                    <Button
                      className={cn('w-full', deliveryOrderStatus[deliveryOrder.deliveryOrderStatus])}
                      type="button"
                      onClick={handlePayClick}
                    >
                      Pay
                    </Button>
                  </div>
                }
              </div>
            </div>
          )}
        </div>
        <div className="mt-4">
          <h1 className="text-2xl font-bold">Delivery offers:</h1>

          {deliveryOrder.deliveryOrderStatus !== DeliveryOrderStatus.Active && (
            <div className="grid w-full grid-cols-1 gap-4 py-4 pb-5 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
              {deliveryOrder.deliveryOffers.map((deliveryOffer) => (
                <DeliveryOfferCard key={deliveryOffer.id} deliveryOffer={deliveryOffer} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
