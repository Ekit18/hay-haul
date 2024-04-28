import { DeliveriesFilterFormValues } from '@/components/deliveries/deliveries-filter/validation';
import { CreateDeliveryFormValues } from '@/components/deliveries/modals/create-delivery/validation';
import { UpdateDeliveryFormValues } from '@/components/deliveries/modals/update-delivery/validation';
import { ServerToClientEventName } from '@/lib/enums/server-to-client-event-name.enum';
import { socket } from '@/lib/helpers/socketService';
import { Delivery } from '@/lib/types/Delivery/Delivery.type';
import { DataWithCount } from '@/lib/types/types';
import { TagType, api } from '@/store/api';
import { BaseQueryFn } from '@reduxjs/toolkit/query';
import { QueryCacheLifecycleApi } from 'node_modules/@reduxjs/toolkit/dist/query/endpointDefinitions';
import { generatePath } from 'react-router-dom';

async function onDeliveryCacheEntryAdded(
    arg: URLSearchParams | string,
    {
        updateCachedData,
        cacheDataLoaded,
        cacheEntryRemoved
    }: QueryCacheLifecycleApi<URLSearchParams | string, BaseQueryFn, DataWithCount<Delivery>, 'api'>
) {
    try {
        //TODO
        // const { data } = await cacheDataLoaded;
        // const auctionIds = data.data.map(({ id }) => id);

        // socket.addListener(
        //     ServerToClientEventName.DeliveryUpdated,
        //     ({ auctionId, currentMaxBid, currentMaxBidId, auctionStatus, currentMaxBidUserId }) => {
        //         updateCachedData((draft) => {
        //             const updatedAuction = draft.data.find((auction) => auction.id === auctionId);
        //             if (!updatedAuction) return;
        //             console.log({ auctionId, currentMaxBid, currentMaxBidId, auctionStatus, currentMaxBidUserId });
        //             if (updatedAuction.currentMaxBid) {
        //                 updatedAuction.currentMaxBid.price = currentMaxBid;
        //                 updatedAuction.currentMaxBid.userId = currentMaxBidUserId;
        //                 updatedAuction.currentMaxBidId = currentMaxBidId;
        //             }

        //             if (auctionStatus) {
        //                 updatedAuction.auctionStatus = auctionStatus;
        //             }
        //         });
        //     }
        // );
    } catch (e) {
        console.log(e);
        // no-op in case `cacheEntryRemoved` resolves before `cacheDataLoaded`,
        // in which case `cacheDataLoaded` will throw
    }
    await cacheEntryRemoved;
    socket.removeAllListeners(ServerToClientEventName.AuctionUpdated);
}

export const deliveryApi = api.injectEndpoints({
    endpoints: (builder) => ({
        createDelivery: builder.mutation<void, CreateDeliveryFormValues>({
            query: (body) => ({
                url: 'delivery',
                method: 'POST',
                body,
            }),
            invalidatesTags: [TagType.Delivery, TagType.Drivers]
        }),
        deleteDelivery: builder.mutation<void, string>({
            query: (id) => ({
                url: generatePath('delivery/:id', { id }),
                method: 'DELETE',
            }),
            invalidatesTags: [TagType.Delivery, TagType.Drivers]
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
            invalidatesTags: [TagType.Delivery, TagType.Drivers]
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