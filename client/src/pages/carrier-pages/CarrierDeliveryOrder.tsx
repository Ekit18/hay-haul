import { DeliveryOrderPageInfo } from '@/components/delivery-order/DeliveryOrderPageInfo';
import { deliveryOrderApi } from '@/store/reducers/delivery-order/deliveryOrderApi';
import { skipToken } from '@reduxjs/toolkit/query';

export function CarrierDeliveryOrderPage() {
  const [filterDeliveryOrders, { data: deliveryOrders, isFetching, isError, isLoading, originalArgs }] =
    deliveryOrderApi.useLazyGetAllDeliveryOrdersQuery();
  const { data } = deliveryOrderApi.useGetAllDeliveryOrdersQuery(originalArgs || skipToken);

  return (
    //replace data with deliveryOrders, just for now
    <DeliveryOrderPageInfo
      deliveryOrders={data}
      isFetching={isFetching}
      trigger={filterDeliveryOrders}
      isLoading={isLoading}
    />
  );
}
