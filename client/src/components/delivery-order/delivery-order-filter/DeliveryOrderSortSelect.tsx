import { Button } from '@/components/ui/button';
import { FormControl, FormItem, FormLabel } from '@/components/ui/form';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { SortOrder } from '@/lib/enums/sort-order.enum';
import { MoveDown, MoveUp } from 'lucide-react';
import { useFormContext } from 'react-hook-form';
import { DeliveryOrderFilterFormValues, deliveryOrderSortKeys, deliveryOrderSortKeyToLabelMap } from './validation';
import { cn } from '@/lib/utils';

const sortOrderToUI = {
  [SortOrder.DESC]: <MoveDown className="mx-1 h-4 w-4" />,
  [SortOrder.ASC]: <MoveUp className="mx-1 h-4 w-4" />
} as const;

export type DeliveryOrderSortSelectInputProps = {
  containerClassName?: string;
};
export function DeliveryOrderSortSelect({ containerClassName }: DeliveryOrderSortSelectInputProps) {
  const { setValue, watch } = useFormContext<DeliveryOrderFilterFormValues>();

  const sortKey = watch('innerSortKey');

  const onSortKeyChange = (value: string) => {
    setValue('innerSortKey', value as DeliveryOrderFilterFormValues['innerSortKey'], {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true
    });
  };

  const sortOrder = watch('innerSortOrder');

  const onSortOrderToggle = () => {
    setValue('innerSortOrder', sortOrder === SortOrder.ASC ? SortOrder.DESC : SortOrder.ASC, {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true
    });
  };

  return (
    <div className={cn('flex flex-col gap-4 md:flex-row lg:ml-4 ', containerClassName)}>
      <div className="w-full">
        <FormItem className="w-full">
          <FormLabel>Sort criterion</FormLabel>
          <Select onValueChange={onSortKeyChange} value={sortKey}>
            <FormControl>
              <div className="flex flex-row">
                <SelectTrigger className="rounded-e-none">
                  <SelectValue placeholder="Sort criterion" />
                </SelectTrigger>
                <Button
                  className="rounded-s-none border-s-0 p-1 text-center"
                  disabled={!sortKey}
                  type="button"
                  variant="outline"
                  onClick={onSortOrderToggle}
                >
                  {sortOrderToUI[sortOrder || SortOrder.ASC]}
                </Button>
              </div>
            </FormControl>
            <SelectContent>
              <SelectGroup>
                {deliveryOrderSortKeys?.map((item) => (
                  <SelectItem key={item} value={item}>
                    {deliveryOrderSortKeyToLabelMap[item]}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </FormItem>
      </div>
    </div>
  );
}
