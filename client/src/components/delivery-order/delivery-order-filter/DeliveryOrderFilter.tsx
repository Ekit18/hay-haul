import { Button } from '@/components/ui/button';
import { FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { SearchInput } from '@/components/ui/search-input';
import { cn } from '@/lib/utils';
import { ChevronDown, Filter } from 'lucide-react';
import { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { DeliveryOrderFilterFormValues } from './validation';
import { DeliveryOrderFilterForm } from './DeliveryOrderFilterForm';
import { CreateDeliveryOrderModalHOC } from '../modals/create-delivery-order/CreateDeliveryOrderModal';
import { useAppSelector } from '@/lib/hooks/redux';
import { UserRole } from '@/lib/enums/user-role.enum';

export function DeliveryOrderFilter() {
  const { control, reset } = useFormContext<DeliveryOrderFilterFormValues>();
  const [filterOpen, setFilterOpen] = useState<boolean>(false);

  const handleFilterOpenToggle = () => {
    setFilterOpen((prev) => !prev);
  };

  const handleClearFilter = () => {
    reset({
      productName: undefined,
      deliveryOrderStatus: [],
      desiredDate: undefined,
      desiredPrice: undefined,
      fromFarmLocation: undefined,
      toDepotLocation: undefined
    });
  };

  const user = useAppSelector((state) => state.user.user);

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
        <div className="flex w-full">
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
          <div className="relative ml-auto">
            {user?.role === UserRole.Businessman && <CreateDeliveryOrderModalHOC />}
          </div>
        </div>
      </div>
      <div className="">{filterOpen && <DeliveryOrderFilterForm />}</div>
    </>
  );
}
