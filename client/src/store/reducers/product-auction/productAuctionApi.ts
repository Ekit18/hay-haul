import { UpdateProductFormValues } from '@/components/products/modals/update-product-modal/validation';
import { ProductAuction } from '@/lib/types/ProductAuction/ProductAuction.type';
import { DataWithCount, UpdateRequestDto } from '@/lib/types/types';
import { TagType, api } from '@/store/api';

export type UpdateProductAuctionDto = UpdateRequestDto<UpdateProductFormValues>;

export const productAuctionApi = api.injectEndpoints({
  endpoints: (builder) => ({
    filterProductAuctions: builder.query<DataWithCount<ProductAuction>, URLSearchParams>({
      query: (searchParams) => ({
        url: '/product/filter',
        params: searchParams
      }),
      providesTags: [TagType.Auction]
    })
    // createProduct: builder.mutation<Product, CreateProductFormValues>({
    //   query: ({ productTypeId, farmId, ...body }) => ({
    //     method: 'POST',
    //     url: generatePath('/product/facility/:facilityId/productType/:productTypeId', {
    //       facilityId: farmId,
    //       productTypeId
    //     }),
    //     body
    //   }),
    //   invalidatesTags: [TagType.Product]
    // }),
    // deleteProduct: builder.mutation<void, string>({
    //   query: (id) => ({
    //     method: 'DELETE',
    //     url: generatePath(`/product/:id`, { id })
    //   }),
    //   invalidatesTags: [TagType.Product]
    // }),
    // updateProduct: builder.mutation<Product, UpdateProductDto>({
    //   query: ({ id, body }) => ({
    //     method: 'PUT',
    //     url: generatePath(`/product/:id`, { id }),
    //     body
    //   }),
    //   invalidatesTags: [TagType.Product]
    // })
  })
});
