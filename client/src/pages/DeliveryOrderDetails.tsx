import { ImageCarousel } from '@/components/carousel/ImageCarousel';
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
import { AppRoute } from '@/lib/constants/routes';
import { DeliveryOrderStatusText } from '@/lib/types/DeliveryOrder/DeliveryOrder.type';
import { cn } from '@/lib/utils';
import { deliveryOrderApi } from '@/store/reducers/delivery-order/deliveryOrderApi';
import { format, parseISO } from 'date-fns';
import { Loader2, Package } from 'lucide-react';
import { useEffect } from 'react';
import { Navigate, generatePath, useNavigate, useParams } from 'react-router-dom';

export function DeliveryOrderDetails() {
  const { deliveryOrderId } = useParams();

  const navigate = useNavigate();

  const [getDeliveryOrder, { data: deliveryOrder, isFetching, isError, isLoading }] =
    deliveryOrderApi.useLazyGetDeliveryOrderQuery();

  useEffect(() => {
    if (!deliveryOrderId) {
      return;
    }
    getDeliveryOrder(deliveryOrderId);
  }, [deliveryOrderId]);

  if (!deliveryOrderId || isError) {
    return <Navigate to={generatePath(AppRoute.Businessman.Delivery)} />;
  }
  if (isFetching || isLoading || !deliveryOrder) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin" />
      </div>
    );
  }

  return (
    <div className="h-full bg-white p-4">
      <div className="pt-10">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink
                className="cursor-pointer"
                onClick={() => {
                  navigate(AppRoute.Businessman.Delivery);
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
                {DeliveryOrderStatusText[deliveryOrder.deliveryOrderStatus]}
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
        </div>
        <div className="mt-4">
          <h1 className="text-2xl font-bold">Delivery offers:</h1>
          {/* {
            user?.role === UserRole.Carrier && (
          } */}
          {/* TODO: add delivery offers */}
        </div>
      </div>
    </div>
  );
}
