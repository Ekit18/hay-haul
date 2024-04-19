import { TagInput } from '@/components/tag-input/TagInput';
import { DatePickerWithRange } from '@/components/ui/date-picker-with-range';
import { NumberInputWithRange } from '@/components/ui/number-input-with-range';
import { ProductAuctionStatus, ProductAuctionStatusDict } from '@/lib/types/ProductAuction/ProductAuction.type';
import { useFormContext } from 'react-hook-form';
import { ProductAuctionSortSelect } from './ProductAuctionSortSelect';
import { ProductAuctionFilterFormValues } from './validation';
import { FormLabel } from '@/components/ui/form';

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
        <div className="flex ">
          <div className="flex w-full max-w-full flex-col">
            <FormLabel className="block">Choose start / end date</FormLabel>
            <div className="mt-3 flex ">
              <DatePickerWithRange<ProductAuctionFilterFormValues, 'startDate'> field="startDate" />
              <DatePickerWithRange<ProductAuctionFilterFormValues, 'endDate'> field="endDate" />
            </div>
          </div>
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
        <ProductAuctionSortSelect containerClassName="lg:ml-0" />
      </div>
    </>
  );
}
