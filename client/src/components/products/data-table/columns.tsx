import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { FormControl, FormField, FormItem } from '@/components/ui/form';
import { SortOrder } from '@/lib/enums/sort-order.enum';
import { Product } from '@/lib/types/Product/Product.type';
import {
  CurrentProductUsageContext,
  useCurrentProductContext
} from '@/pages/farmer-pages/contexts/currentProductContext';
import { ColumnDef } from '@tanstack/react-table';
import { MoreHorizontal, MoveDown, MoveUp } from 'lucide-react';
import { useFormContext } from 'react-hook-form';
import { ProductFilterFormValues } from '../product-filter/validation';

export const columns: ColumnDef<Product>[] = [
  {
    accessorKey: 'name',
    header: ({ column }) => {
      const { control } = useFormContext<ProductFilterFormValues>();
      const sort = column.getIsSorted() === 'asc';
      return (
        <div className="w-full flex justify-center">
          <FormField
            control={control}
            name="nameSort"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Button
                    variant="ghost"
                    type="button"
                    onClick={() => {
                      console.log(column.getIsSorted());
                      const sort = column.getIsSorted() === 'asc';
                      field.onChange(sort ? SortOrder.DESC : SortOrder.ASC);
                      column.toggleSorting(sort);
                    }}
                  >
                    Name
                    {sort ? <MoveUp className="ml-2 h-4 w-4" /> : <MoveDown className="ml-2 h-4 w-4" />}
                  </Button>
                </FormControl>
              </FormItem>
            )}
          />
        </div>
      );
    },
    cell: ({ row }) => {
      const name = row.getValue('name') as string;
      return <div className="text-center font-medium">{name}</div>;
    }
  },
  {
    accessorKey: 'quantity',
    header: ({ column }) => {
      const { control } = useFormContext<ProductFilterFormValues>();

      const sort = column.getIsSorted() === 'asc';

      return (
        <div className="w-full flex justify-center">
          <FormField
            control={control}
            name="quantitySort"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Button
                    variant="ghost"
                    type="button"
                    onClick={() => {
                      field.onChange(sort ? SortOrder.DESC : SortOrder.ASC);
                      column.toggleSorting(sort, true);
                    }}
                  >
                    Quantity
                    {sort ? <MoveUp className="ml-2 h-4 w-4" /> : <MoveDown className="ml-2 h-4 w-4" />}
                  </Button>
                </FormControl>
              </FormItem>
            )}
          />
        </div>
      );
    },
    cell: ({ row }) => {
      const quantity = row.getValue('quantity') as string;
      return <div className="text-center font-medium">{quantity}</div>;
    }
  },
  {
    accessorKey: 'facilityDetails.name',
    id: 'farmName',
    header: () => {
      return <div className="w-full text-center">Farm name</div>;
    },
    cell: ({ row }) => {
      const facilityDetailsName = row.getValue('farmName') as string;
      return <div className="text-center font-medium">{facilityDetailsName}</div>;
    }
  },
  {
    accessorKey: 'facilityDetails.address',
    header: () => {
      return <div className="w-full text-center">Farm address</div>;
    },
    id: 'farmAddress',
    cell: ({ row }) => {
      const farmAddress = row.getValue('farmAddress') as string;
      return <div className="text-center font-medium">{farmAddress}</div>;
    }
  },
  {
    accessorKey: 'productType.name',
    id: 'productType',
    header: ({ column }) => {
      const { control } = useFormContext<ProductFilterFormValues>();

      const sort = column.getIsSorted() === 'asc';

      return (
        <div className="w-full flex justify-center">
          <FormField
            control={control}
            name="productTypeSort"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Button
                    variant="ghost"
                    type="button"
                    onClick={() => {
                      field.onChange(sort ? SortOrder.DESC : SortOrder.ASC);
                      column.toggleSorting(sort);
                    }}
                  >
                    Product type
                    {sort ? <MoveUp className="ml-2 h-4 w-4" /> : <MoveDown className="ml-2 h-4 w-4" />}
                  </Button>
                </FormControl>
              </FormItem>
            )}
          />
        </div>
      );
    },
    cell: ({ row }) => {
      const productType = row.getValue('productType') as string;
      return <div className="text-center font-medium">{productType}</div>;
    }
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const product = row.original;
      const { setCurrentProduct, setUsageContext } = useCurrentProductContext();
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => {
                setCurrentProduct(product);
                setUsageContext(CurrentProductUsageContext.Edit);
              }}
            >
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                setCurrentProduct(product);
                setUsageContext(CurrentProductUsageContext.Delete);
              }}
            >
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    }
  }
];
