import ProductAuctionPageInfo from '@/components/product-auction/product-auction-page-info/ProductAuctionPageInfo';
import { productAuctionApi } from '@/store/reducers/product-auction/productAuctionApi';
import { skipToken } from '@reduxjs/toolkit/query';

export function MyAuctions() {
  const [filterProductAuctions, { data: productAuctions, isLoading, isFetching, fulfilledTimeStamp, originalArgs }] =
    productAuctionApi.useLazyFilterFarmerProductAuctionsQuery();

  productAuctionApi.useFilterFarmerProductAuctionsQuery(originalArgs || skipToken);

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
