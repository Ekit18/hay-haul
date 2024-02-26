import { ProductsFilter } from '@/components/products/product-filter/ProductsFilter';
import { ProductsTable } from '@/components/products/ProductsTable';

export function ProductsPage() {
  return (
    <>
      <div className="">
        <div className="p-4 bg-white">
          <h2 className="text-3xl font-bold mb-9">Products</h2>
          <ProductsFilter />
        </div>
        <ProductsTable />
      </div>
    </>
  );
}
