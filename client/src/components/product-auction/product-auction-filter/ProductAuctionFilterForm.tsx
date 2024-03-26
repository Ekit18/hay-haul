import { DatePickerWithRange } from '@/components/ui/date-picker-with-range';
import { FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useAppSelector } from '@/lib/hooks/redux';
import { useFormContext } from 'react-hook-form';
import { ProductAuctionFilterFormValues } from './validation';

export function ProductAuctionFilterForm() {
  const { control, getValues, trigger, setValue } = useFormContext<ProductAuctionFilterFormValues>();

  const user = useAppSelector((state) => state.user.user);

  if (!user) {
    return null;
  }
  // TODO: rewrite number input ranges to use NumberInputWithRange. Also do it for product filter
  return (
    <>
      <div className="mt-10 flex gap-4 flex-col md:flex-row">
        <DatePickerWithRange<ProductAuctionFilterFormValues, 'startDate'>
          field="startDate"
          title="Min/Max start date"
        />
        <DatePickerWithRange<ProductAuctionFilterFormValues, 'endDate'> field="endDate" title="Min/Max end date" />

        <div className="flex flex-col w-full justify-end">
          <p className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            Quantity
          </p>
          <div className="flex mt-3">
            <FormField
              control={control}
              name="minQuantity"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      placeholder="Min"
                      {...field}
                      onBlur={(e) => {
                        if (e.target.value === '') {
                          field.onChange(0);
                        }
                      }}
                      onChange={(e) => {
                        field.onChange(e.target.value);

                        trigger('maxQuantity');
                      }}
                      type="number"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <span className="text-3xl px-2">-</span>
            <FormField
              control={control}
              name="maxQuantity"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      placeholder="Max"
                      {...field}
                      onBlur={(e) => {
                        if (e.target.value === '') {
                          field.onChange(0);
                        }
                      }}
                      onChange={(e) => {
                        field.onChange(e.target.value);

                        trigger('minQuantity');
                      }}
                      type="number"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
      </div>
    </>
  );
}
