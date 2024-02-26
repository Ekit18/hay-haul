import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ChevronDown, Filter, Plus } from 'lucide-react';
import { useState } from 'react';
import { SearchInput } from '../../ui/search-input';
import { ProductFilterForm } from './ProductFilterForm';

interface ProductsFilterProps {
  a?: any;
}

export function ProductsFilter({ a }: ProductsFilterProps) {
  const [filterOpen, setFilterOpen] = useState<boolean>(false);

  const handleFilterOpenToggle = () => {
    setFilterOpen((prev) => !prev);
  };

  const handleCreateProductClick = () => {
    console.log('create product');
  };

  return (
    <>
      <div className="flex flex-row justify-between">
        <div className="w-4/12">
          <SearchInput placeholder="Name, quantity, type" />
        </div>
        <Button onClick={handleFilterOpenToggle} className="flex gap-1 ml-4">
          <Filter size={20} /> Filter <ChevronDown className={cn('h-4 w-4 shrink-0 ', filterOpen && 'rotate-180')} />
        </Button>
        <Button onClick={handleCreateProductClick} className="flex gap-1 ml-auto">
          <Plus size={20} /> Create Product
        </Button>
      </div>
      <div className="">{filterOpen && <ProductFilterForm />}</div>
    </>
  );
}
