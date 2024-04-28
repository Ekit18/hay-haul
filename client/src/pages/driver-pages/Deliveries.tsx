import { DeliveriesPageInfo } from '@/components/deliveries/DeliveriesPageInfo';
import { deliveryApi } from '@/store/reducers/delivery/deliveryApi';
import { skipToken } from '@reduxjs/toolkit/query';

export function Deliveries() {
  const [filterDeliveries, { data: deliveries, isFetching, isError, isLoading, originalArgs }] =
    deliveryApi.useLazyGetAllDriversDeliveriesQuery();

  const { data } = deliveryApi.useGetAllDriversDeliveriesQuery(originalArgs || skipToken);

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
