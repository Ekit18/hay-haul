import { Button } from '@/components/ui/button';
import { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown } from 'lucide-react';
import { useFormContext } from 'react-hook-form';
import { ProductFilterFormValues } from '../product-filter/validation';

export type ProductColumn = {
  id: string;
  name: string;
  quantity: number;
  farmName: string;
  productType: string;
  farmAddress: string;
};

export const columns: ColumnDef<ProductColumn>[] = [
  {
    accessorKey: 'name',
    header: ({ column }) => {
      const { watch } = useFormContext<ProductFilterFormValues>();

      return (
        <Button variant="ghost" type="button" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
          Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    }
  },
  {
    accessorKey: 'quantity',
    header: ({ column }) => {
      return (
        <Button variant="ghost" type="button" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
          Quantity
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    }
  },
  {
    accessorKey: 'farmName',
    header: 'Farm name'
  },
  {
    accessorKey: 'farmAddress',
    header: 'Farm address'
  },
  {
    accessorKey: 'productType',
    header: ({ column }) => {
      return (
        <Button type="button" variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
          Product type
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    }
  }
];
