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
    // createProductAuction: builder.mutation<ProductAuction, CreateProductAuctionFormValues>({
    //   query: ({ productTypeId, farmId, ...body }) => ({
    //     method: 'POST',
    //     url: generatePath('/product/facility/:facilityId/productType/:productTypeId', {
    //       facilityId: farmId,
    //       productTypeId
    //     }),
    //     body
    //   }),
    //   invalidatesTags: [TagType.ProductAuction]
    // }),
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
