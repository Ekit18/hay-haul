import { DeliveriesPageInfo } from '@/components/deliveries/DeliveriesPageInfo';
import { DeliveryOrderPageInfo } from '@/components/delivery-order/DeliveryOrderPageInfo';
import { deliveryOrderApi } from '@/store/reducers/delivery-order/deliveryOrderApi';
import { deliveryApi } from '@/store/reducers/delivery/deliveryApi';
import { skipToken } from '@reduxjs/toolkit/query';

export function DeliveriesPage() {
  const [filterDeliveries, { data: deliveries, isFetching, isError, isLoading, originalArgs }] =
    deliveryApi.useLazyGetAllDeliveriesByCarrierIdQuery();
  const { data } = deliveryApi.useGetAllDeliveriesByCarrierIdQuery(originalArgs || skipToken);

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
