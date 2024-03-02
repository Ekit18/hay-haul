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
  const { control } = useFormContext<ProductFilterFormValues>();
  const [filterOpen, setFilterOpen] = useState<boolean>(false);

  const handleFilterOpenToggle = () => {
    setFilterOpen((prev) => !prev);
  };

  return (
    <>
      <div className="flex flex-row justify-between">
        <div className="w-4/12">
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
        <Button onClick={handleFilterOpenToggle} className="flex gap-1 ml-4" type="button">
          <Filter size={20} /> Filter <ChevronDown className={cn('h-4 w-4 shrink-0 ', filterOpen && 'rotate-180')} />
        </Button>
        <CreateProductModal />
      </div>
      <div className="">{filterOpen && <ProductFilterForm />}</div>
      <div className="flex justify-end mt-6">
        <Button className="px-16" type="submit">
          Search
        </Button>
      </div>
    </>
  );
}
