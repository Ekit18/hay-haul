import { UpdateProductAuctionForm } from '@/components/product-auction/update-product-auction/UpdateProductAuctionForm';

export function UpdateAuction() {
  console.log('????');
  return (
    <div className="mt-6 h-full bg-gray-100">
      <div className="bg-white p-4 pt-6">
        <h2 className="text-3xl font-bold">Update auction</h2>
      </div>
      <div className="grid w-full grid-cols-1 gap-4 bg-gray-100 px-4 pt-5">
        <UpdateProductAuctionForm />
      </div>
    </div>
  );
}
