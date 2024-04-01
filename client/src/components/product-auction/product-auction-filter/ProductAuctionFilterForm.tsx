import { TagInput } from '@/components/tag-input/TagInput';
import { DatePickerWithRange } from '@/components/ui/date-picker-with-range';
import { NumberInputWithRange } from '@/components/ui/number-input-with-range';
import { ProductAuctionStatus, ProductAuctionStatusDict } from '@/lib/types/ProductAuction/ProductAuction.type';
import { useFormContext } from 'react-hook-form';
import { ProductAuctionSortSelect } from './ProductAuctionSortSelect';
import { ProductAuctionFilterFormValues } from './validation';

const STATUSES = Object.entries(ProductAuctionStatus);
// console.log(STATUSES);

export function ProductAuctionFilterForm() {
  const { control } = useFormContext<ProductAuctionFilterFormValues>();

  return (
    <>
      <div className="mt-10 grid gap-4 flex-col md:flex-row md:grid-cols-3">
        <NumberInputWithRange<ProductAuctionFilterFormValues, 'startPrice'>
          fieldName="startPrice"
          title="Start Price"
          key="startPrice"
        />
        <NumberInputWithRange<ProductAuctionFilterFormValues, 'buyoutPrice'>
          fieldName="buyoutPrice"
          title="Buyout Price"
          key="buyoutPrice"
        />
        <div className="flex">
          <DatePickerWithRange<ProductAuctionFilterFormValues, 'startDate'> field="startDate" title="Start date" />
          <DatePickerWithRange<ProductAuctionFilterFormValues, 'endDate'> field="endDate" title="End date" />
        </div>
        <NumberInputWithRange<ProductAuctionFilterFormValues, 'quantity'>
          fieldName="quantity"
          title="Quantity"
          key="quantity"
        />
        <TagInput
          labelText="Select statuses"
          control={control}
          noOptionsText="No matching auctions"
          name="statuses"
          suggestions={STATUSES.map(([k, v]) => ({
            label: v,
            value: k
          }))}
          selectedFn={(item: string) => ({
            label: (ProductAuctionStatus as ProductAuctionStatusDict)[item],
            value: item
          })}
        />
        <ProductAuctionSortSelect />
      </div>
    </>
  );
}
