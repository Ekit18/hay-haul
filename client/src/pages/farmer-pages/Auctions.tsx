import ProductAuctionPageInfo from '@/components/product-auction/product-auction-page-info/ProductAuctionPageInfo';
import { productAuctionApi } from '@/store/reducers/product-auction/productAuctionApi';

export function AllAuction() {
  const [filterProductAuctions, { data: productAuctions, isLoading, isFetching }] =
    productAuctionApi.useLazyFilterProductAuctionsQuery();

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
