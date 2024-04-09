import { CreateDeliveryOrderValues } from '@/components/delivery-order/modals/create-delivery-order/validation';
import { DeliveryOrder } from '@/lib/types/DeliveryOrder/DeliveryOrder.type';
import { TagType, api } from '@/store/api';
import { generatePath } from 'react-router-dom';

export const deliveryOrderApi = api.injectEndpoints({
  endpoints: (build) => ({
    createDeliveryOrder: build.mutation<DeliveryOrder, CreateDeliveryOrderValues>({
      query: ({ auctionId, depotId, desiredDate, desiredPrice }) => ({
        url: generatePath('/delivery-order/product-auction/:auctionId/depot/:depotId', {
          auctionId,
          depotId
        }),
        method: 'POST',
        body: {
          desiredDate,
          desiredPrice
        }
      }),
      invalidatesTags: [TagType.DeliveryOrder]
    }),
    getDeliveryOrders: build.query<DeliveryOrder[], void>({
      query: () => ({
        url: '/delivery-order',
        method: 'GET'
      }),
      providesTags: [TagType.DeliveryOrder]
    })
  })
});
