import { CreateDeliveryOrderValues } from '@/components/delivery-order/modals/create-delivery-order/validation';
import { UpdateDeliveryOrderValues } from '@/components/delivery-order/modals/update-delivery-order/validation';
import { ClientToServerEventName } from '@/lib/enums/client-to-server-event-name.enum';
import { ServerToClientEventName } from '@/lib/enums/server-to-client-event-name.enum';
import { socket } from '@/lib/helpers/socketService';
import { DeliveryOrder } from '@/lib/types/DeliveryOrder/DeliveryOrder.type';
import { DataWithCount, UpdateRequestDto } from '@/lib/types/types';
import { TagType, api } from '@/store/api';
import { BaseQueryFn } from '@reduxjs/toolkit/query';
import { QueryCacheLifecycleApi } from 'node_modules/@reduxjs/toolkit/dist/query/endpointDefinitions';
import { generatePath } from 'react-router-dom';

export type UpdateDeliveryOrderDto = UpdateRequestDto<UpdateDeliveryOrderValues>;

export type DeliveryOrderLocationsQueryResponse = {
  fromFarmLocations: string[];
  toDepotLocations: string[];
};

async function onDeliveryOrderCacheEntryAdded(
  arg: URLSearchParams | string,
  {
    updateCachedData,
    cacheDataLoaded,
    cacheEntryRemoved
  }: QueryCacheLifecycleApi<URLSearchParams | string, BaseQueryFn, DataWithCount<DeliveryOrder>, 'api'>
) {
  try {
    const { data } = await cacheDataLoaded;
    const deliveryOrderIds = data.data.map(({ id }) => id);

    socket.emit({ event: ClientToServerEventName.JOIN_DELIVERY_ORDER_ROOMS, eventPayload: deliveryOrderIds });
    socket.addListener(
      ServerToClientEventName.DeliveryOrderUpdated,
      ({ deliveryOffers, deliveryOrderId, deliveryOrderStatus }) => {
        updateCachedData((draft) => {
          const updatedDeliveryOrder = draft.data.find((deliveryOrder) => deliveryOrder.id === deliveryOrderId);
          if (!updatedDeliveryOrder) return;
          if (deliveryOffers.length !== updatedDeliveryOrder.deliveryOffers.length) {
            updatedDeliveryOrder.deliveryOffers = deliveryOffers;
          }

          if (deliveryOrderStatus) {
            updatedDeliveryOrder.deliveryOrderStatus = deliveryOrderStatus;
          }
        });
      }
    );
  } catch (e) {
    console.log(e);
    // no-op in case `cacheEntryRemoved` resolves before `cacheDataLoaded`,
    // in which case `cacheDataLoaded` will throw
  }
  await cacheEntryRemoved;
  socket.removeAllListeners(ServerToClientEventName.DeliveryOrderUpdated);
}

export const deliveryOrderApi = api.injectEndpoints({
  endpoints: (build) => ({
    getAllFarmAndDepotLocations: build.query<DeliveryOrderLocationsQueryResponse, URLSearchParams>({
      query: (searchParams) => ({
        url: generatePath('/delivery-order/locations'),
        params: searchParams
      }),
      providesTags: [TagType.DeliveryOrderLocations]
    }),
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
      invalidatesTags: [TagType.DeliveryOrder, TagType.DeliveryOrderLocations]
    }),
    getDeliveryOrders: build.query<DataWithCount<DeliveryOrder>, URLSearchParams>({
      query: (searchParams) => ({
        url: '/delivery-order',
        method: 'GET',
        params: searchParams
      }),
      onCacheEntryAdded: onDeliveryOrderCacheEntryAdded,
      providesTags: [TagType.DeliveryOrder]
    }),
    getDeliveryOrder: build.query<DataWithCount<DeliveryOrder>, string>({
      query: (id) => ({
        url: generatePath('/delivery-order/order/:id', { id }),
        method: 'GET'
      }),
      onCacheEntryAdded: onDeliveryOrderCacheEntryAdded,
      providesTags: [TagType.DeliveryOrder]
    }),
    getAllDeliveryOrders: build.query<DataWithCount<DeliveryOrder>, URLSearchParams>({
      query: (searchParams) => ({
        url: '/delivery-order/all-orders',
        method: 'GET',
        params: searchParams
      }),
      onCacheEntryAdded: onDeliveryOrderCacheEntryAdded,
      providesTags: [TagType.DeliveryOrder]
    }),
    deleteDeliveryOrder: build.mutation<void, string>({
      query: (id) => ({
        url: generatePath('/delivery-order/:id', { id }),
        method: 'DELETE'
      }),
      invalidatesTags: [TagType.DeliveryOrder, TagType.DeliveryOrderLocations]
    }),
    startDeliveryOrder: build.mutation<void, string>({
      query: (id) => ({
        url: generatePath('/delivery-order/:id', { id }),
        method: 'POST'
      }),
      invalidatesTags: [TagType.DeliveryOrder, TagType.DeliveryOrderLocations]
    }),
    updateDeliveryOrder: build.mutation<DeliveryOrder, UpdateDeliveryOrderDto>({
      query: ({ id, body }) => ({
        url: generatePath('/delivery-order/:id', { id }),
        method: 'PATCH',
        body
      }),
      invalidatesTags: [TagType.DeliveryOrder, TagType.DeliveryOrderLocations]
    })
  })
});
