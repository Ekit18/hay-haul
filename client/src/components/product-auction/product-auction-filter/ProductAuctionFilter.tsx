import { Button } from '@/components/ui/button';
import { FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { AppRoute } from '@/lib/constants/routes';
import { UserRole } from '@/lib/enums/user-role.enum';
import { useAppSelector } from '@/lib/hooks/redux';
import { cn } from '@/lib/utils';
import { ChevronDown, Filter, Plus } from 'lucide-react';
import { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { SearchInput } from '../../ui/search-input';
import { ProductAuctionFilterForm } from './ProductAuctionFilterForm';
import './styles.module.css';
import { ProductAuctionFilterFormValues } from './validation';

export function ProductAuctionFilter() {
  const navigate = useNavigate();
  const user = useAppSelector((state) => state.user.user);
  const { control, reset } = useFormContext<ProductAuctionFilterFormValues>();
  const [filterOpen, setFilterOpen] = useState<boolean>(false);

  const handleFilterOpenToggle = () => {
    setFilterOpen((prev) => !prev);
  };

  const handleClearFilter = () => {
    reset({
      productName: undefined,
      startPrice: undefined,
      buyoutPrice: undefined,
      startDate: undefined,
      endDate: undefined,
      quantity: undefined,
      statuses: []
    });
  };

  return (
    <>
      <div className="flex flex-col justify-between gap-4 md:flex-row md:gap-0">
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
            className="border-dashed underline  decoration-wavy hover:text-secondary"
            onClick={handleClearFilter}
          >
            Clear filter
          </Button>
        </div>
        {user?.role === UserRole.Farmer && (
          <Button
            className="flex gap-1 sm:ml-auto sm:w-60 md:w-auto"
            type="button"
            onClick={() => navigate(AppRoute.Farmer.CreateAuction)}
          >
            <Plus size={20} /> Create Auction
          </Button>
        )}
      </div>
      <div className="">{filterOpen && <ProductAuctionFilterForm />}</div>
    </>
  );
}
