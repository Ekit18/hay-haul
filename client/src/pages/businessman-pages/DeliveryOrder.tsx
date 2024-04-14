import { DeliveryOrderCard } from '@/components/delivery-order/card/DeliveryOrderCard';
import { CreateDeliveryOrderModalHOC } from '@/components/delivery-order/modals/create-delivery-order/CreateDeliveryOrderModal';
import { deliveryOrderApi } from '@/store/reducers/delivery-order/deliveryOrderApi';
import { Loader2 } from 'lucide-react';

export function DeliveryOrder() {
  const { data: deliveryOrders, isFetching, isError, isLoading } = deliveryOrderApi.useGetDeliveryOrdersQuery();

  if (isFetching || isLoading || !deliveryOrders) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin" />
      </div>
    );
  }

  return (
    <>
      <div className="">
        <div className="flex flex-col gap-2">
          <div className="bg-white p-4">
            <h2 className="mb-9 mt-6 text-3xl font-bold">Delivery orders</h2>
          </div>
          <div className="flex w-full justify-end pr-5">
            <CreateDeliveryOrderModalHOC />
          </div>
          <div className="grid w-full grid-cols-1 gap-4 px-4 pt-5 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
            {deliveryOrders?.map((deliveryOrder) => (
              <DeliveryOrderCard key={deliveryOrder.id} deliveryOrder={deliveryOrder} />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
