import { CreateProductFormValues } from '@/components/products/modals/create-product-modal/validation';
import { UpdateProductFormValues } from '@/components/products/modals/update-product-modal/validation';
import { Product } from '@/lib/types/Product/Product.type';
import { DataWithCount } from '@/lib/types/types';
import { TagType, api } from '@/store/api';
import { generatePath } from 'react-router-dom';

export type UpdateProductDto = {
  body: UpdateProductFormValues;
  id: string;
};

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

// createProduct response
// {
//   "name": "TESTATES2T",
//   "quantity": 10,
//   "facilityDetails": {
//       "createdAt": "2024-03-01T20:20:22.596Z",
//       "updatedAt": "2024-03-01T20:20:22.596Z",
//       "id": "68C60C21-09D8-EE11-B05A-C8CB9E61A061",
//       "name": "tetet",
//       "address": "tete",
//       "code": "tetet",
//       "productTypes": [
//           {
//               "createdAt": "2024-03-01T20:20:22.606Z",
//               "updatedAt": "2024-03-01T20:20:22.606Z",
//               "id": "69C60C21-09D8-EE11-B05A-C8CB9E61A061",
//               "facilityDetailsId": "68C60C21-09D8-EE11-B05A-C8CB9E61A061",
//               "name": "Wheat"
//           },
//           {
//               "createdAt": "2024-03-01T20:20:22.606Z",
//               "updatedAt": "2024-03-01T20:20:22.606Z",
//               "id": "6AC60C21-09D8-EE11-B05A-C8CB9E61A061",
//               "facilityDetailsId": "68C60C21-09D8-EE11-B05A-C8CB9E61A061",
//               "name": "Tomatoes"
//           },
//           {
//               "createdAt": "2024-03-01T20:20:22.606Z",
//               "updatedAt": "2024-03-01T20:20:22.606Z",
//               "id": "6BC60C21-09D8-EE11-B05A-C8CB9E61A061",
//               "facilityDetailsId": "68C60C21-09D8-EE11-B05A-C8CB9E61A061",
//               "name": "Carrots"
//           }
//       ]
//   },
//   "productType": {
//       "createdAt": "2024-03-01T20:20:22.606Z",
//       "updatedAt": "2024-03-01T20:20:22.606Z",
//       "id": "6BC60C21-09D8-EE11-B05A-C8CB9E61A061",
//       "facilityDetailsId": "68C60C21-09D8-EE11-B05A-C8CB9E61A061",
//       "name": "Carrots"
//   },
//   "facilityDetailsId": "68C60C21-09D8-EE11-B05A-C8CB9E61A061",
//   "createdAt": "2024-03-02T16:49:51.746Z",
//   "updatedAt": "2024-03-02T16:49:51.746Z",
//   "id": "7389E5E2-B4D8-EE11-B05C-C8CB9E61A061"
// }
