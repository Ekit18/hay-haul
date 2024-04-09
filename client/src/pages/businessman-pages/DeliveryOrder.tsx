import { DeliveryOrderCard } from '@/components/delivery-order/card/DeliveryOrderCard';
import { CreateDeliveryOrderModalHOC } from '@/components/delivery-order/modals/create-delivery-order/CreateDeliveryOrderModal';
import { deliveryOrderApi } from '@/store/reducers/delivery-order/deliveryOrderApi';

export function DeliveryOrder() {
  const { data: deliveryOrders } = deliveryOrderApi.useGetDeliveryOrdersQuery();

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
          <div className="grid w-full grid-cols-1 gap-4 px-4 pt-5 sm:grid-cols-2 lg:grid-cols-3">
            {deliveryOrders?.map((deliveryOrder) => (
              <DeliveryOrderCard key={deliveryOrder.id} deliveryOrder={deliveryOrder} />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
