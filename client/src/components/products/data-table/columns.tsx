import { productAuctionStatus } from '@/components/product-auction/product-auction-card/ProductAuctionStatus.enum';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { FormControl, FormField, FormItem } from '@/components/ui/form';
import { SortOrder } from '@/lib/enums/sort-order.enum';
import { Product } from '@/lib/types/Product/Product.type';
import { ProductAuctionStatus, ProductAuctionStatusText } from '@/lib/types/ProductAuction/ProductAuction.type';
import { SortOrderValues } from '@/lib/types/types';
import { cn } from '@/lib/utils';
import {
  CurrentProductUsageContext,
  useCurrentProductContext
} from '@/pages/farmer-pages/contexts/currentProductContext';
import { ColumnDef } from '@tanstack/react-table';
import { MoreHorizontal, MoveDown, MoveUp } from 'lucide-react';
import { useEffect } from 'react';
import { useFormContext } from 'react-hook-form';
import { ProductFilterFormValues } from '../product-filter/validation';

const sortOrderToUI = {
  [SortOrder.DESC.toLowerCase()]: <MoveDown className="ml-2 h-4 w-4" />,
  [SortOrder.ASC.toLowerCase()]: <MoveUp className="ml-2 h-4 w-4" />
} as const;

export const columns: ColumnDef<Product>[] = [
  {
    accessorKey: 'name',
    header: ({ column }) => {
      const { control, setValue } = useFormContext<ProductFilterFormValues>();

      const sort = column.getIsSorted();

      useEffect(() => {
        setValue('nameSort', sort ? (sort.toUpperCase() as SortOrderValues) : undefined);
      }, [sort]);

      return (
        <div className="flex w-full justify-center">
          <FormField
            control={control}
            name="nameSort"
            render={() => (
              <FormItem>
                <FormControl>
                  <Button
                    variant="ghost"
                    type="button"
                    onClick={() => {
                      column.toggleSorting(undefined, true);
                    }}
                  >
                    Name
                    <div className="h-4 w-4">{sort && sortOrderToUI[sort]}</div>
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
      const { control, setValue } = useFormContext<ProductFilterFormValues>();

      const sort = column.getIsSorted();

      useEffect(() => {
        setValue('quantitySort', sort ? (sort.toUpperCase() as SortOrderValues) : undefined);
      }, [sort]);

      return (
        <div className="flex w-full justify-center">
          <FormField
            control={control}
            name="quantitySort"
            render={() => (
              <FormItem>
                <FormControl>
                  <Button
                    variant="ghost"
                    type="button"
                    onClick={() => {
                      column.toggleSorting(undefined, true);
                    }}
                  >
                    Quantity
                    <div className="h-4 w-4">{sort && sortOrderToUI[sort]}</div>
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
      return <div className="w-full text-center">Facility name</div>;
    },
    cell: ({ row }) => {
      const facilityDetailsName = row.getValue('farmName') as string;
      return <div className="text-center font-medium">{facilityDetailsName}</div>;
    }
  },
  {
    accessorKey: 'facilityDetails.address',
    header: () => {
      return <div className="w-full text-center">Facility address</div>;
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
      const { control, setValue } = useFormContext<ProductFilterFormValues>();

      const sort = column.getIsSorted();

      useEffect(() => {
        setValue('productTypeSort', sort ? (sort.toUpperCase() as SortOrderValues) : undefined);
      }, [sort]);

      return (
        <div className="flex w-full justify-center">
          <FormField
            control={control}
            name="productTypeSort"
            render={() => (
              <FormItem>
                <FormControl>
                  <Button
                    variant="ghost"
                    type="button"
                    onClick={() => {
                      column.toggleSorting(undefined, true);
                    }}
                  >
                    Product type
                    <div className="h-4 w-4">{sort && sortOrderToUI[sort]}</div>
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
      return product.productAuction === null ||
        product.productAuction.auctionStatus === ProductAuctionStatus.Inactive ||
        product.productAuction.auctionStatus === ProductAuctionStatus.StartSoon ? (
        <DropdownMenu>
          <DropdownMenuTrigger asChild className="flex">
            <div className="flex h-full w-full justify-center">
              <div className="">
                <Button variant="ghost" className="h-full w-full">
                  <span className="sr-only">Open menu</span>
                  <MoreHorizontal className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
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
      ) : (
        <div className="flex w-full justify-center">
          <p
            className={cn(
              'w-max whitespace-nowrap rounded-lg p-2 text-sm',
              productAuctionStatus[product.productAuction.auctionStatus]
            )}
          >
            {ProductAuctionStatusText[product.productAuction.auctionStatus]}
          </p>
        </div>
      );
    }
  }
];
