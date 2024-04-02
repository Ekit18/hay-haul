import { CreateProductAuctionForm } from '@/components/product-auction/create-product-auction/CreateProductAuctionForm';

export function CreateAuction() {
  return (
    <div className="mt-6 h-full bg-gray-100">
      <div className="bg-white p-4 pt-6">
        <h2 className="mb-9 text-3xl font-bold">Create auction</h2>
      </div>
      <div className="grid w-full grid-cols-1 gap-4 bg-gray-100 px-4 pt-5">
        <CreateProductAuctionForm />
      </div>
    </div>
  );
}
