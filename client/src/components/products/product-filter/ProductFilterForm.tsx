import { TagInput } from '@/components/tag-input/TagInput';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAppSelector } from '@/lib/hooks/redux';
import { facilityDetailsApi } from '@/store/reducers/facility-details/facilityDetailsApi';
import { useEffect } from 'react';
import { useFormContext } from 'react-hook-form';
import { ProductFilterFormValues } from './validation';

export function ProductFilterForm() {
  const { control, getValues, trigger, setValue } = useFormContext<ProductFilterFormValues>();

  const user = useAppSelector((state) => state.user.user);

  if (!user) {
    return null;
  }

  const userId = user.id;
  const farmId = getValues('farmId');

  const { data: farms } = facilityDetailsApi.useGetAllByUserIdQuery(userId);

  const productTypesByFarmId = farms?.find((farm) => farm.id === farmId)?.productTypes || [];

  useEffect(() => {
    setValue('productTypeId', []);
  }, [farmId]);

  return (
    <>
      <div className="mt-10 flex gap-4 flex-col md:flex-row">
        <FormField
          control={control}
          name="farmId"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>Farm</FormLabel>
              <Select onValueChange={field.onChange} value={field.value} disabled={!farms?.length}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a farm" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectGroup>
                    {farms?.map((farm) => (
                      <SelectItem key={farm.id} value={farm.id}>
                        {farm.name}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <TagInput
          labelText="Select farm products"
          control={control}
          noOptionsText="No matching products"
          name="productTypeId"
          disabled={!farms?.length || !farmId}
          suggestions={productTypesByFarmId.map((productType) => ({
            label: productType.name,
            value: productType.id
          }))}
          selectedFn={(item: string) => ({
            label: productTypesByFarmId.find((product) => product.id === item)?.name as string,
            value: item
          })}
        />

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
