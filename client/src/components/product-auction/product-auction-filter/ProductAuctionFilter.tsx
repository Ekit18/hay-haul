import { Button } from '@/components/ui/button';
import { FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { cn } from '@/lib/utils';
import { ChevronDown, Filter } from 'lucide-react';
import { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { SearchInput } from '../../ui/search-input';
import { ProductAuctionFilterForm } from './ProductAuctionFilterForm';
import './styles.module.css';
import { ProductAuctionFilterFormValues } from './validation';

export function ProductAuctionFilter() {
  const { control, reset } = useFormContext<ProductAuctionFilterFormValues>();
  const [filterOpen, setFilterOpen] = useState<boolean>(false);

  const handleFilterOpenToggle = () => {
    setFilterOpen((prev) => !prev);
  };

  const handleClearFilter = () => {
    reset({
      minStartPrice: 0,
      maxStartPrice: 0,
      minBuyoutPrice: 0,
      maxBuyoutPrice: 0,
      startDate: undefined,
      endDate: undefined,
      minQuantity: 0,
      maxQuantity: 0,
      statuses: undefined
    });
  };

  return (
    <>
      <div className="flex flex-col md:flex-row gap-4 md:gap-0 justify-between">
        <div className="w-full md:w-4/12">
          <FormField
            control={control}
            name="productName"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormControl>
                  <SearchInput placeholder="Enter product name..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="flex">
          <Button onClick={handleFilterOpenToggle} className="flex gap-1 md:ml-4" type="button">
            <Filter size={20} /> Filter <ChevronDown className={cn('h-4 w-4 shrink-0 ', filterOpen && 'rotate-180')} />
          </Button>
          <Button
            variant="link"
            className="underline decoration-wavy  border-dashed hover:text-secondary"
            onClick={handleClearFilter}
          >
            Clear filter
          </Button>
        </div>
        {/* <CreateProductAuctionModal /> */}
      </div>
      <div className="">{filterOpen && <ProductAuctionFilterForm />}</div>
    </>
  );
}
