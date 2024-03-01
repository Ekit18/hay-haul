import { Product } from '@/lib/types/Product/Product.type';
import { useMemo } from 'react';
import { ProductColumn, columns } from './data-table/columns';
import { DataTable } from './data-table/data-table';

interface ProductsTableProps {
  data?: { data: Product[] };
}

// const testdata = [
//   {
//     id: 'asdasdsad',
//     name: 'Top rice',
//     quantity: 10022,
//     farmName: 'Farm',
//     farmAddress: 'Mykolaiv',
//     productType: 'Rice'
//   }
// ];

export function ProductsTable({ data }: ProductsTableProps) {
  console.log(data);
  const columnData = useMemo<ProductColumn[]>(
    () =>
      !data
        ? []
        : data.data.map((product) => ({
            id: product.id,
            name: product.name,
            quantity: product.quantity,
            farmName: product.facilityDetails.name,
            farmAddress: product.facilityDetails.address,
            productType: product.productType.name
          })),
    [data]
  );
  return <DataTable columns={columns} data={columnData} />;
}
