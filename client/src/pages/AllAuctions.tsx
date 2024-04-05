import ProductAuctionPageInfo from '@/components/product-auction/product-auction-page-info/ProductAuctionPageInfo';
import { productAuctionApi } from '@/store/reducers/product-auction/productAuctionApi';
import { skipToken } from '@reduxjs/toolkit/query';

export function AllAuction() {
  const [filterProductAuctions, { data: productAuctions, isLoading, isFetching, originalArgs }] =
    productAuctionApi.useLazyFilterProductAuctionsQuery();
  productAuctionApi.useFilterProductAuctionsQuery(originalArgs || skipToken);

  return (
    <ProductAuctionPageInfo
      trigger={filterProductAuctions}
      data={productAuctions}
      isLoading={isLoading}
      isFetching={isFetching}
      pageLabel="All Auctions"
    />
  );
}
