import { CreateProductAuctionFormValues } from '@/components/product-auction/create-product-auction/validation';
import { RestartProductAuctionFormValues } from '@/components/product-auction/modals/restart-auction-modal/validation';
import { UpdateProductAuctionFormValues } from '@/components/product-auction/update-product-auction/validation';
import { ClientToServerEventName } from '@/lib/enums/client-to-server-event-name.enum';
import { ServerToClientEventName } from '@/lib/enums/server-to-client-event-name.enum';
import { socket } from '@/lib/helpers/socketService';
import { ProductAuction } from '@/lib/types/ProductAuction/ProductAuction.type';
import { DataWithCount, UpdateRequestDto } from '@/lib/types/types';
import { TagType, api } from '@/store/api';
import { BaseQueryFn } from '@reduxjs/toolkit/query';
import { QueryCacheLifecycleApi } from 'node_modules/@reduxjs/toolkit/dist/query/endpointDefinitions';
import { generatePath } from 'react-router-dom';

export type UpdateProductAuctionDto = UpdateRequestDto<UpdateProductAuctionFormValues>;
export type RestartProductAuctionDto = UpdateRequestDto<RestartProductAuctionFormValues>;

async function onProductAuctionCacheEntryAdded(
  arg: URLSearchParams | string,
  {
    updateCachedData,
    cacheDataLoaded,
    cacheEntryRemoved
  }: QueryCacheLifecycleApi<URLSearchParams | string, BaseQueryFn, DataWithCount<ProductAuction>, 'api'>
) {
  try {
    const { data } = await cacheDataLoaded;
    const auctionIds = data.data.map(({ id }) => id);

    socket.emit({ event: ClientToServerEventName.JOIN_PRODUCT_AUCTION_ROOMS, eventPayload: auctionIds });
    socket.addListener(
      ServerToClientEventName.AuctionUpdated,
      ({ auctionId, currentMaxBid, currentMaxBidId, auctionStatus, currentMaxBidUserId }) => {
        updateCachedData((draft) => {
          const updatedAuction = draft.data.find((auction) => auction.id === auctionId);
          if (!updatedAuction) return;
          console.log({ auctionId, currentMaxBid, currentMaxBidId, auctionStatus, currentMaxBidUserId });
          if (updatedAuction.currentMaxBid) {
            updatedAuction.currentMaxBid.price = currentMaxBid;
            updatedAuction.currentMaxBid.userId = currentMaxBidUserId;
            updatedAuction.currentMaxBidId = currentMaxBidId;
          }

          if (auctionStatus) {
            updatedAuction.auctionStatus = auctionStatus;
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
  socket.removeAllListeners(ServerToClientEventName.AuctionUpdated);
}

export const productAuctionApi = api.injectEndpoints({
  endpoints: (builder) => ({
    filterProductAuctions: builder.query<DataWithCount<ProductAuction>, URLSearchParams>({
      query: (searchParams) => ({
        url: 'product-auction/filter',
        params: searchParams
      }),
      serializeQueryArgs: ({ endpointName }) => {
        return endpointName;
      },
      merge: (currentCache, newItems, { arg }) => {
        if (arg.get('offset') !== null) {
          currentCache.data.push(...newItems.data);
        } else {
          currentCache.count = newItems.count;
          currentCache.data = newItems.data;
        }
      },
      forceRefetch({ currentArg, previousArg }) {
        return currentArg?.get('offset') !== previousArg?.get('offset');
      },
      keepUnusedDataFor: 0,
      onCacheEntryAdded: onProductAuctionCacheEntryAdded,
      providesTags: [TagType.ProductAuction]
    }),
    filterFarmerProductAuctions: builder.query<DataWithCount<ProductAuction>, URLSearchParams>({
      query: (searchParams) => ({
        url: 'product-auction/filter/farmer',
        params: searchParams
      }),
      serializeQueryArgs: ({ endpointName }) => {
        return endpointName;
      },
      merge: (currentCache, newItems, { arg }) => {
        console.log(currentCache.data);
        if (arg.get('offset') !== null) {
          currentCache.data.push(...newItems.data);
        } else {
          currentCache.count = newItems.count;
          currentCache.data = newItems.data;
        }
      },
      forceRefetch({ currentArg, previousArg }) {
        return currentArg?.get('offset') !== previousArg?.get('offset');
      },
      keepUnusedDataFor: 0,
      onCacheEntryAdded: onProductAuctionCacheEntryAdded,
      providesTags: [TagType.ProductAuction]
    }),
    filterBusinessmanProductAuctions: builder.query<DataWithCount<ProductAuction>, URLSearchParams>({
      query: (searchParams) => ({
        url: 'product-auction/filter/businessman',
        params: searchParams
      }),
      serializeQueryArgs: ({ endpointName }) => {
        return endpointName;
      },
      merge: (currentCache, newItems, { arg }) => {
        console.log(currentCache.data);
        if (arg.get('offset') !== null) {
          currentCache.data.push(...newItems.data);
        } else {
          currentCache.count = newItems.count;
          currentCache.data = newItems.data;
        }
      },
      forceRefetch({ currentArg, previousArg }) {
        return currentArg?.get('offset') !== previousArg?.get('offset');
      },
      keepUnusedDataFor: 0,
      onCacheEntryAdded: onProductAuctionCacheEntryAdded,
      providesTags: [TagType.ProductAuction]
    }),
    getProductAuction: builder.query<DataWithCount<ProductAuction>, string>({
      query: (id) => ({
        url: generatePath(`/product-auction/:id`, { id })
      }),
      onCacheEntryAdded: onProductAuctionCacheEntryAdded,
      providesTags: [TagType.ProductAuction]
    }),
    restartProductAuction: builder.mutation<ProductAuction, RestartProductAuctionDto>({
      query: ({ id, body }) => ({
        method: 'POST',
        url: generatePath(`/product-auction/restart/:id`, { id }),
        body: {
          startDate: body.startEndDate.from,
          endDate: body.startEndDate.to,
          paymentPeriod: body.paymentPeriod
        }
      }),
      // onCacheEntryAdded: onProductAuctionRestartedCacheEntryAdded,
      invalidatesTags: [TagType.ProductAuction]
    }),
    getPaidProductAuctions: builder.query<DataWithCount<ProductAuction>, string>({
      query: () => ({
        url: 'product-auction/paid-auctions'
      })
    }),
    createProductAuction: builder.mutation<ProductAuction, CreateProductAuctionFormValues>({
      query: ({ facilityId: _, productId, photos, ...body }) => {
        const bodyFormData = new FormData();
        photos.forEach(async (photo) => {
          const arrayBuffer = await photo.arrayBuffer;
          const blob = new Blob([new Uint8Array(arrayBuffer)], { type: photo.type });
          const file = new File([blob], photo.name, { type: photo.type });
          bodyFormData.append('photos', file);
        });

        Object.entries(body).forEach(([key, value]) => {
          if (key === 'startEndDate' && typeof value === 'object' && 'from' in value && 'to' in value) {
            bodyFormData.append('startDate', value.from.toString());
            bodyFormData.append('endDate', value.to.toString());
            return;
          }
          bodyFormData.append(key, value.toString());
        });
        return {
          method: 'POST',
          url: generatePath('/product-auction/product/:productId', {
            productId
          }),
          body: bodyFormData
        };
      },
      invalidatesTags: [TagType.ProductAuction]
    }),
    deleteProductAuction: builder.mutation<void, string>({
      query: (id) => ({
        method: 'DELETE',
        url: generatePath(`/product-auction/:id`, { id })
      }),
      invalidatesTags: [TagType.ProductAuction]
    }),
    updateProductAuction: builder.mutation<ProductAuction, UpdateProductAuctionDto>({
      query: ({ id, ...body }) => {
        const { photos, farmName: _, productName: _2, ...rest } = body.body;
        const bodyFormData = new FormData();
        photos.forEach(async (photo) => {
          const arrayBuffer = await photo.arrayBuffer;
          const blob = new Blob([new Uint8Array(arrayBuffer)], { type: photo.type });
          const file = new File([blob], photo.name, { type: photo.type });
          bodyFormData.append('photos', file);
        });

        Object.entries(rest).forEach(([key, value]) => {
          if (key === 'startEndDate' && typeof value === 'object' && 'from' in value && 'to' in value) {
            bodyFormData.append('startDate', value.from.toString());
            bodyFormData.append('endDate', value.to.toString());
            return;
          }
          bodyFormData.append(key, value.toString());
        });
        return {
          method: 'PUT',
          url: generatePath(`/product-auction/:id`, { id }),
          body: bodyFormData
        };
      },
      invalidatesTags: [TagType.ProductAuction]
    })
  })
});
