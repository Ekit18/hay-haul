import { Button } from '@/components/ui/button';
import { FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { cn } from '@/lib/utils';
import { ChevronDown, Filter } from 'lucide-react';
import { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { SearchInput } from '../../ui/search-input';
import { CreateProductModal } from '../modals/create-product-modal/create-product-modal';
import { ProductFilterForm } from './ProductFilterForm';
import './styles.module.css';
import { ProductFilterFormValues } from './validation';

export function ProductsFilter() {
  const { control, reset } = useFormContext<ProductFilterFormValues>();
  const [filterOpen, setFilterOpen] = useState<boolean>(false);

  const handleFilterOpenToggle = () => {
    setFilterOpen((prev) => !prev);
  };

  const handleClearFilter = () => {
    reset({
      minQuantity: 0,
      maxQuantity: 0,
      farmId: '',
      productTypeId: []
    });
  };

  return (
    <>
      <div className="flex flex-col md:flex-row gap-4 md:gap-0 justify-between">
        <div className="w-full md:w-4/12">
          <FormField
            control={control}
            name="searchQuery"
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
        <CreateProductModal />
      </div>
      <div className="">{filterOpen && <ProductFilterForm />}</div>
    </>
  );
}
