import { DeliveryOrderPageInfo } from '@/components/delivery-order/DeliveryOrderPageInfo';
import { deliveryOrderApi } from '@/store/reducers/delivery-order/deliveryOrderApi';
import { skipToken } from '@reduxjs/toolkit/query';

export function DeliveriesPage() {
  const [filterDeliveries, { data: deliveries, isFetching, isError, isLoading, originalArgs }] =
    deliveryApi.useLazyGetAllDeliveriesQuery();
  const { data } = deliveryApi.useGetAllDeliveriesQuery(originalArgs || skipToken);

  return (
    <DeliveriesPageInfo
      deliveries={deliveries}
      isFetching={isFetching}
      trigger={filterDeliveries}
      isLoading={isLoading}
      label="Deliveries"
    />
  );
}
