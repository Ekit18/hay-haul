import { ProductType } from '@/lib/types/ProductType/ProductType.type';
import { TagType, api } from '@/store/api';
import { generatePath } from 'react-router-dom';

export type CreateProductTypeDto = {
  farmId: string;
  name: string;
};

export const productsTypesApi = api.injectEndpoints({
  endpoints: (builder) => ({
    createProductType: builder.mutation<ProductType, CreateProductTypeDto>({
      query: ({ farmId, ...body }) => ({
        method: 'POST',
        url: generatePath('/product-type/facility/:facilityId', {
          facilityId: farmId
        }),
        body
      }),
      invalidatesTags: [TagType.Facility]
    }),
    deleteProductType: builder.mutation<void, string>({
      query: (id) => ({
        method: 'DELETE',
        url: generatePath(`/product-type/:id`, { id })
      }),
      invalidatesTags: [TagType.Facility]
    })
  })
});
