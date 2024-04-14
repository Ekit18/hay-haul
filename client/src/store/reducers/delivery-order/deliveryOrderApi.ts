import { CreateDeliveryOrderValues } from '@/components/delivery-order/modals/create-delivery-order/validation';
import { UpdateDeliveryOrderValues } from '@/components/delivery-order/modals/update-delivery-order/validation';
import { DeliveryOrder } from '@/lib/types/DeliveryOrder/DeliveryOrder.type';
import { UpdateRequestDto } from '@/lib/types/types';
import { TagType, api } from '@/store/api';
import { generatePath } from 'react-router-dom';

export type UpdateDeliveryOrderDto = UpdateRequestDto<UpdateDeliveryOrderValues>;

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
    }),
    getDeliveryOrder: build.query<DeliveryOrder, string>({
      query: (id) => ({
        url: generatePath('/delivery-order/:id', { id }),
        method: 'GET'
      }),
      providesTags: [TagType.DeliveryOrder]
    }),
    deleteDeliveryOrder: build.mutation<void, string>({
      query: (id) => ({
        url: generatePath('/delivery-order/:id', { id }),
        method: 'DELETE'
      }),
      invalidatesTags: [TagType.DeliveryOrder]
    }),
    startDeliveryOrder: build.mutation<void, string>({
      query: (id) => ({
        url: generatePath('/delivery-order/:id', { id }),
        method: 'POST'
      }),
      invalidatesTags: [TagType.DeliveryOrder]
    }),
    updateDeliveryOrder: build.mutation<DeliveryOrder, UpdateDeliveryOrderDto>({
      query: ({ id, body }) => ({
        url: generatePath('/delivery-order/:id', { id }),
        method: 'PATCH',
        body
      }),
      invalidatesTags: [TagType.DeliveryOrder]
    })
  })
});
