import ProductAuctionPageInfo from '@/components/product-auction/product-auction-page-info/ProductAuctionPageInfo';
import { productAuctionApi } from '@/store/reducers/product-auction/productAuctionApi';
import { skipToken } from '@reduxjs/toolkit/query';
import { useEffect } from 'react';

export function MyAuctions() {
  const [filterProductAuctions, { data: productAuctions, isLoading, isFetching, fulfilledTimeStamp, originalArgs }] =
    productAuctionApi.useLazyFilterFarmerProductAuctionsQuery();

  productAuctionApi.useFilterFarmerProductAuctionsQuery(originalArgs || skipToken);

  useEffect(() => {
    console.log('lazy farmer query');
    console.log(productAuctions);
    console.log(fulfilledTimeStamp && new Date(fulfilledTimeStamp));
  }, [fulfilledTimeStamp, productAuctions, fulfilledTimeStamp]);

  return (
    <ProductAuctionPageInfo
      trigger={filterProductAuctions}
      data={productAuctions}
      isLoading={isLoading}
      pageLabel="My auctions"
      isFetching={isFetching}
    />
  );
}
