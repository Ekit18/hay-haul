import { UpdateProductAuctionForm } from '@/components/product-auction/update-product-auction/UpdateProductAuctionForm';

export function UpdateAuction() {
  return (
    <div className="mt-6 h-full bg-gray-100">
      <div className="p-4 pt-6 bg-white">
        <h2 className="text-3xl font-bold">Update auction</h2>
      </div>
      <div className="px-4 w-full grid grid-cols-1 gap-4 pt-5 bg-gray-100">
        <UpdateProductAuctionForm />
      </div>
    </div>
  );
}
