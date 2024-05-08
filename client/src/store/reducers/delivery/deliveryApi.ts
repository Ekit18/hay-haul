import { DeliveriesFilterFormValues } from '@/components/deliveries/deliveries-filter/validation';
import { CreateDeliveryFormValues } from '@/components/deliveries/modals/create-delivery/validation';
import { UpdateDeliveryFormValues } from '@/components/deliveries/modals/update-delivery/validation';
import { ClientToServerEventName } from '@/lib/enums/client-to-server-event-name.enum';
import { ServerToClientEventName } from '@/lib/enums/server-to-client-event-name.enum';
import { socket } from '@/lib/helpers/socketService';
import { Delivery, DeliveryStatusValues } from '@/lib/types/Delivery/Delivery.type';
import { DataWithCount } from '@/lib/types/types';
import { TagType, api } from '@/store/api';
import { BaseQueryFn } from '@reduxjs/toolkit/query';
import { QueryCacheLifecycleApi } from 'node_modules/@reduxjs/toolkit/dist/query/endpointDefinitions';
import { generatePath } from 'react-router-dom';

async function onDeliveryCacheEntryAdded<T>(
    arg: URLSearchParams | string,
    {
        updateCachedData,
        cacheDataLoaded,
        cacheEntryRemoved,
        dispatch
    }: QueryCacheLifecycleApi<URLSearchParams | string, BaseQueryFn, T, 'api'>
) {
    try {
        socket.addListener(
            ServerToClientEventName.DeliveryUpdated,
            () => {
                console.log("DELIVERY UPDATE")
                dispatch(api.util.invalidateTags([TagType.Delivery, TagType.Drivers]))
            }
        );
    } catch (e) {
        console.log(e);
        // no-op in case `cacheEntryRemoved` resolves before `cacheDataLoaded`,
        // in which case `cacheDataLoaded` will throw
    }
    await cacheEntryRemoved;
    socket.removeAllListeners(ServerToClientEventName.DeliveryUpdated);
}

export type GetDeliveryStatusResponse = {
    deliveryStatus: DeliveryStatusValues
}

export const deliveryApi = api.injectEndpoints({
    endpoints: (builder) => ({
        getDeliveryStatusById: builder.query<GetDeliveryStatusResponse, string>({
            query: (id) => ({
                url: generatePath('delivery/status/:id', { id }),
            }),
            onCacheEntryAdded: onDeliveryCacheEntryAdded,
            providesTags: [TagType.Delivery]
        }),
        createDelivery: builder.mutation<void, CreateDeliveryFormValues>({
            query: (body) => ({
                url: 'delivery',
                method: 'POST',
                body,
            }),
            invalidatesTags: [TagType.Delivery, TagType.Drivers, TagType.DeliveryOrder]
        }),
        deleteDelivery: builder.mutation<void, string>({
            query: (id) => ({
                url: generatePath('delivery/:id', { id }),
                method: 'DELETE',
            }),
            invalidatesTags: [TagType.Delivery, TagType.Drivers, TagType.DeliveryOrder]
        }),
        getAllDeliveriesByCarrierId: builder.query<DataWithCount<Delivery>, URLSearchParams>({
            query: (searchParams) => ({
                url: 'delivery',
                method: 'GET',
                params: searchParams,
            }),
            providesTags: [TagType.Delivery],
            onCacheEntryAdded: onDeliveryCacheEntryAdded,
        }),
        updateDelivery: builder.mutation<void, { id: string, body: UpdateDeliveryFormValues }>({
            query: ({ id, body }) => ({
                url: generatePath('delivery/by-carrier/:id', { id }),
                method: 'PATCH',
                body,
            }),
            invalidatesTags: [TagType.Delivery, TagType.Drivers, TagType.DeliveryOrder]
        }),
        updateDeliveryByDriver: builder.mutation<void, { id: string }>({
            query: ({ id }) => ({
                url: generatePath('delivery/by-driver/:id', { id }),
                method: 'PATCH',
            }),
            invalidatesTags: [TagType.Delivery, TagType.Drivers]
        }),
        getAllDriversDeliveries: builder.query<DataWithCount<Delivery>, URLSearchParams>({
            query: (searchParams) => ({
                url: 'delivery/drivers-deliveries',
                method: 'GET',
                params: searchParams,
            }),
            providesTags: [TagType.Drivers, TagType.Delivery]
        }),
        getDeliveryById: builder.query<Delivery, string>({
            query: (id) => ({
                url: generatePath('delivery/:id', { id }),
                method: 'GET',
            }),
            providesTags: [TagType.Delivery]
        }),
    })
})