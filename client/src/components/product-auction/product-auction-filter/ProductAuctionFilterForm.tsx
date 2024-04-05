import { TagInput } from '@/components/tag-input/TagInput';
import { DatePickerWithRange } from '@/components/ui/date-picker-with-range';
import { NumberInputWithRange } from '@/components/ui/number-input-with-range';
import { ProductAuctionStatus, ProductAuctionStatusDict } from '@/lib/types/ProductAuction/ProductAuction.type';
import { useFormContext } from 'react-hook-form';
import { ProductAuctionSortSelect } from './ProductAuctionSortSelect';
import { ProductAuctionFilterFormValues } from './validation';

const STATUSES = Object.entries(ProductAuctionStatus);

export function ProductAuctionFilterForm() {
  const { control } = useFormContext<ProductAuctionFilterFormValues>();

  return (
    <>
      <div className="mt-10 grid flex-col gap-4 md:grid-cols-3 md:flex-row">
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
          suggestions={STATUSES.map(([key, value]) => ({
            label: value,
            value: key
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
