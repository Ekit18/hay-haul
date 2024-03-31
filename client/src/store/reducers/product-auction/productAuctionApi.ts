import { CreateProductAuctionFormValues } from '@/components/product-auction/create-product-auction/validation';
import { UpdateProductFormValues } from '@/components/products/modals/update-product-modal/validation';
import { ClientToServerEventName } from '@/lib/enums/client-to-server-event-name.enum';
import { ServerToClientEventName } from '@/lib/enums/server-to-client-event-name.enum';
import { socket } from '@/lib/helpers/socketService';
import { ProductAuction } from '@/lib/types/ProductAuction/ProductAuction.type';
import { DataWithCount, UpdateRequestDto } from '@/lib/types/types';
import { TagType, api } from '@/store/api';
import { RootState as AppRootState } from '@/store/store';
import { BaseQueryFn } from '@reduxjs/toolkit/query';
import { QueryCacheLifecycleApi } from 'node_modules/@reduxjs/toolkit/dist/query/endpointDefinitions';
import { generatePath } from 'react-router-dom';

export type UpdateProductAuctionDto = UpdateRequestDto<UpdateProductFormValues>;

async function onProductAuctionCacheEntryAdded(
  arg: URLSearchParams,
  {
    updateCachedData,
    cacheDataLoaded,
    cacheEntryRemoved,
    getState
  }: QueryCacheLifecycleApi<URLSearchParams, BaseQueryFn, DataWithCount<ProductAuction>, 'api'>
) {
  try {
    const { data } = await cacheDataLoaded;
    const auctionIds = data.data.map(({ id }) => id);
    const state = getState() as unknown as AppRootState;
    const token = state.accessToken.accessToken;
    socket.connect(token);
    socket.emit({ event: ClientToServerEventName.JOIN_PRODUCT_AUCTION_ROOMS, eventPayload: auctionIds });
    socket.addListener(ServerToClientEventName.AuctionUpdated, ({ auctionId, currentMaxBid, currentMaxBidId }) => {
      updateCachedData((draft) => {
        console.log('old data');
        console.log(draft.data.find((auction) => auction.id === auctionId)?.currentMaxBid);
        const updatedAuction = draft.data.find((auction) => auction.id === auctionId);
        if (updatedAuction) {
          updatedAuction.currentMaxBid = currentMaxBid;
          updatedAuction.currentMaxBidId = currentMaxBidId;
        }
        console.log('new data');
        console.log(draft.data.find((auction) => auction.id === auctionId)?.currentMaxBid);
      });
    });
  } catch {
    // no-op in case `cacheEntryRemoved` resolves before `cacheDataLoaded`,
    // in which case `cacheDataLoaded` will throw
  }
  await cacheEntryRemoved;
}

export const productAuctionApi = api.injectEndpoints({
  endpoints: (builder) => ({
    filterProductAuctions: builder.query<DataWithCount<ProductAuction>, URLSearchParams>({
      query: (searchParams) => ({
        url: 'product-auction/filter',
        params: searchParams
      }),
      onCacheEntryAdded: onProductAuctionCacheEntryAdded,
      providesTags: [TagType.ProductAuction]
    }),
    filterFarmerProductAuctions: builder.query<DataWithCount<ProductAuction>, URLSearchParams>({
      query: (searchParams) => ({
        url: 'product-auction/filter/farmer',
        params: searchParams
      }),
      onCacheEntryAdded: onProductAuctionCacheEntryAdded,
      providesTags: [TagType.ProductAuction]
    }),
    filterBusinessmanProductAuctions: builder.query<DataWithCount<ProductAuction>, URLSearchParams>({
      query: (searchParams) => ({
        url: 'product-auction/filter/businessman',
        params: searchParams
      }),
      onCacheEntryAdded: onProductAuctionCacheEntryAdded,
      providesTags: [TagType.ProductAuction]
    }),
    createProductAuction: builder.mutation<ProductAuction, CreateProductAuctionFormValues>({
      query: ({ farmId: _, productId, photos, ...body }) => {
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
      query: ({ id, body }) => ({
        method: 'PUT',
        url: generatePath(`/product-auction/:id`, { id }),
        body
      }),
      invalidatesTags: [TagType.ProductAuction]
    })
  })
});
