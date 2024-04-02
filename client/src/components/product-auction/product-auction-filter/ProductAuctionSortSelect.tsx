import { Button } from '@/components/ui/button';
import { FormControl, FormItem, FormLabel } from '@/components/ui/form';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { SortOrder } from '@/lib/enums/sort-order.enum';
import { SortOrderValues } from '@/lib/types/types';
import { MoveDown, MoveUp } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { ProductAuctionFilterFormValues, productAuctionSortKeyToLabelMap, productAuctionSortKeys } from './validation';

const sortOrderToUI = {
  [SortOrder.DESC.toLowerCase()]: <MoveDown className="mx-1 h-4 w-4" />,
  [SortOrder.ASC.toLowerCase()]: <MoveUp className="mx-1 h-4 w-4" />
} as const;

export type ProductAuctionSortSelectInputProps = {};
export function ProductAuctionSortSelect({}) {
  const { setValue } = useFormContext<ProductAuctionFilterFormValues>();

  const [sortKey, setSortKey] = useState<ProductAuctionFilterFormValues['innerSortKey']>();
  const onSortKeyChange = (value: string) => {
    setSortKey(value as ProductAuctionFilterFormValues['innerSortKey']);
  };
  useEffect(() => {
    setValue('innerSortKey', sortKey, { shouldDirty: true, shouldTouch: true, shouldValidate: true });
  }, [sortKey]);

  const [sortOrder, setSortOrder] = useState<SortOrderValues>(SortOrder.ASC);
  const onSortOrderToggle = () => {
    setSortOrder((prev) => (prev === SortOrder.ASC ? SortOrder.DESC : SortOrder.ASC));
  };
  useEffect(() => {
    setValue('innerSortOrder', sortOrder, {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true
    });
  }, [sortOrder]);
  return (
    <div className="flex flex-col gap-4 md:flex-row lg:ml-4 ">
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
                  {sortOrderToUI[sortOrder.toLowerCase()]}
                </Button>
              </div>
            </FormControl>
            <SelectContent>
              <SelectGroup>
                {productAuctionSortKeys?.map((item) => (
                  <SelectItem key={item} value={item}>
                    {productAuctionSortKeyToLabelMap[item]}
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
