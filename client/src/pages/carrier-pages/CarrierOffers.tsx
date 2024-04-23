import { DeliveryOrderPageInfo } from '@/components/delivery-order/DeliveryOrderPageInfo';
import { deliveryOrderApi } from '@/store/reducers/delivery-order/deliveryOrderApi';
import { skipToken } from '@reduxjs/toolkit/query';

export function CarrierOffers() {
  const [getCarrierOffers, { data: carrierOffers, isFetching, isError, isLoading, originalArgs }] =
    deliveryOrderApi.useLazyGetCarrierOffersQuery();
  const { data } = deliveryOrderApi.useGetCarrierOffersQuery(originalArgs || skipToken);

  return (
    <DeliveryOrderPageInfo
      deliveryOrders={carrierOffers}
      isFetching={isFetching}
      trigger={getCarrierOffers}
      isLoading={isLoading}
      label="Carrier Offers"
    />
  );
}
