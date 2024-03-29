import { TagInput } from '@/components/tag-input/TagInput';
import { DatePickerWithRange } from '@/components/ui/date-picker-with-range';
import { NumberInputWithRange } from '@/components/ui/number-input-with-range';
import { ProductAuctionStatus, ProductAuctionStatusDict } from '@/lib/types/ProductAuction/ProductAuction.type';
import { useFormContext } from 'react-hook-form';
import { ProductAuctionFilterFormValues } from './validation';

const STATUSES = Object.entries(ProductAuctionStatus);
// console.log(STATUSES);

export function ProductAuctionFilterForm() {
  const { control } = useFormContext<ProductAuctionFilterFormValues>();

  // TODO: rewrite number input ranges to use NumberInputWithRange. Also do it for product filter
  return (
    <>
      <div className="mt-10 flex gap-4 flex-col md:flex-row">
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
        <DatePickerWithRange<ProductAuctionFilterFormValues, 'startDate'> field="startDate" title="Start date" />
        <DatePickerWithRange<ProductAuctionFilterFormValues, 'endDate'> field="endDate" title="End date" />
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
      </div>
    </>
  );
}
