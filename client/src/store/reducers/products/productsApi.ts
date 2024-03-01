import { Product } from '@/lib/types/Product/Product.type';
import { api } from '@/store/api';

export const productsApi = api.injectEndpoints({
  endpoints: (build) => ({
    filterProducts: build.query<Product[], URLSearchParams>({
      query: (searchParams) => ({
        method: 'GET',
        url: '/product/filter',
        params: searchParams
      })
    })
  })
});
