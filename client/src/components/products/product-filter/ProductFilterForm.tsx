import { TagInput } from '@/components/tag-input/TagInput';
import { FilterSelect } from '@/components/ui/filter-select';
import { FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useAppSelector } from '@/lib/hooks/redux';
import { FacilityDetails } from '@/lib/types/FacilityDetails/FacilityDetails.type';
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
  const productTypeId = getValues('productTypeId');

  const { data: farms } = facilityDetailsApi.useGetAllByUserIdQuery(userId);

  const productTypesByFarmId = farms?.find((farm) => farm.id === farmId)?.productTypes || [];

  useEffect(() => {
    if (!farmId) return;

    if (
      productTypeId &&
      productTypeId.length &&
      productTypesByFarmId.find((product) => product.id === productTypeId[0])
    )
      return;

    setValue('productTypeId', []);
  }, [farmId]);

  return (
    <>
      <div className=" flex flex-col gap-4 md:flex-row">
        <FilterSelect<ProductFilterFormValues, FacilityDetails[]>
          valueProperty="name"
          title="Farm"
          placeholder="Select a farm"
          values={farms}
          fieldName="farmId"
          containerClassName="mt-10 flex gap-4 flex-col md:flex-row w-full"
        />
        <div className="mt-10 w-full">
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
        </div>

        <div className="flex w-full flex-col justify-end">
          <p className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            Quantity
          </p>
          <div className="mt-3 flex">
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
            <span className="px-2 text-3xl">-</span>
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
