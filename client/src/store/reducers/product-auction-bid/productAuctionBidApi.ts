import { SetBidFormValues } from '@/components/product-auction/set-bid-form/validation';
import { TagType, api } from '@/store/api';
import { generatePath } from 'react-router-dom';

export const productBidApi = api.injectEndpoints({
  endpoints: (build) => ({
    setBid: build.mutation<void, SetBidFormValues>({
      query: ({ auctionId, price, ...rest }) => ({
        url: generatePath('product-auction-bid/auction/:auctionId', { auctionId }),
        method: 'POST',
        body: { price }
      }),
      invalidatesTags: [TagType.ProductAuction]
    })
  })
});
