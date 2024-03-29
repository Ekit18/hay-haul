import { CreateProductAuctionFormValues } from '@/components/product-auction/create-product-auction/validation';
import { UpdateProductFormValues } from '@/components/products/modals/update-product-modal/validation';
import { ProductAuction } from '@/lib/types/ProductAuction/ProductAuction.type';
import { DataWithCount, UpdateRequestDto } from '@/lib/types/types';
import { TagType, api } from '@/store/api';
import { generatePath } from 'react-router-dom';

export type UpdateProductAuctionDto = UpdateRequestDto<UpdateProductFormValues>;

export const productAuctionApi = api.injectEndpoints({
  endpoints: (builder) => ({
    filterProductAuctions: builder.query<DataWithCount<ProductAuction>, URLSearchParams>({
      query: (searchParams) => ({
        url: 'product-auction/filter',
        params: searchParams
      }),
      providesTags: [TagType.ProductAuction]
    }),
    filterFarmerProductAuctions: builder.query<DataWithCount<ProductAuction>, URLSearchParams>({
      query: (searchParams) => ({
        url: 'product-auction/filter/farmer',
        params: searchParams
      }),
      providesTags: [TagType.ProductAuction]
    }),
    filterBusinessmanProductAuctions: builder.query<DataWithCount<ProductAuction>, URLSearchParams>({
      query: (searchParams) => ({
        url: 'product-auction/filter/businessman',
        params: searchParams
      }),
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
