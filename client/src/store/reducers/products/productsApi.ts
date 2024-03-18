import { CreateProductFormValues } from '@/components/products/modals/create-product-modal/validation';
import { UpdateProductFormValues } from '@/components/products/modals/update-product-modal/validation';
import { Product } from '@/lib/types/Product/Product.type';
import { DataWithCount, UpdateRequestDto } from '@/lib/types/types';
import { TagType, api } from '@/store/api';
import { generatePath } from 'react-router-dom';

export type UpdateProductDto = UpdateRequestDto<UpdateProductFormValues>;

export const productsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    filterProducts: builder.query<DataWithCount<Product>, URLSearchParams>({
      query: (searchParams) => ({
        url: '/product/filter',
        params: searchParams
      }),
      providesTags: [TagType.Product]
    }),
    createProduct: builder.mutation<Product, CreateProductFormValues>({
      query: ({ productTypeId, farmId, ...body }) => ({
        method: 'POST',
        url: generatePath('/product/facility/:facilityId/productType/:productTypeId', {
          facilityId: farmId,
          productTypeId
        }),
        body
      }),
      invalidatesTags: [TagType.Product]
    }),
    deleteProduct: builder.mutation<void, string>({
      query: (id) => ({
        method: 'DELETE',
        url: generatePath(`/product/:id`, { id })
      }),
      invalidatesTags: [TagType.Product]
    }),
    updateProduct: builder.mutation<Product, UpdateProductDto>({
      query: ({ id, body }) => ({
        method: 'PUT',
        url: generatePath(`/product/:id`, { id }),
        body
      }),
      invalidatesTags: [TagType.Product]
    })
  })
});
