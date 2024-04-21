import { DeliveryOrderPageInfo } from '@/components/delivery-order/DeliveryOrderPageInfo';
import { DeliveryOrder } from '@/lib/types/DeliveryOrder/DeliveryOrder.type';
import { deliveryOrderApi } from '@/store/reducers/delivery-order/deliveryOrderApi';
import { skipToken } from '@reduxjs/toolkit/query';

export function BusinessDeliveryOrderPage() {
  const [filterDeliveryOrders, { data: deliveryOrders, isFetching, isError, isLoading, originalArgs }] =
    deliveryOrderApi.useLazyGetDeliveryOrdersQuery();
  const { data } = deliveryOrderApi.useGetDeliveryOrdersQuery(originalArgs || skipToken);

  console.log('deliveryOrders', data);
  // replace data with deliveryOrders, just for now
  return (
    <DeliveryOrderPageInfo
      trigger={filterDeliveryOrders}
      deliveryOrders={deliveryOrders}
      isFetching={isFetching}
      isLoading={isLoading}
    />
  );
}

export type DeliveryOrderPageInfoProps = {
  deliveryOrders: DeliveryOrder[] | undefined;
  isFetching: boolean;
  isLoading: boolean;
};
