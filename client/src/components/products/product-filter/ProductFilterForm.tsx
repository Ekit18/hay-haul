import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAppSelector } from '@/lib/hooks/redux';
import { cn } from '@/lib/utils';
import { facilityDetailsApi } from '@/store/reducers/facility-details/facilityDetailsApi';
import { useFormContext } from 'react-hook-form';
import { ReactTags } from 'react-tag-autocomplete';
import { ProductFilterFormValues } from './validation';

export function ProductFilterForm() {
  const { control, getValues } = useFormContext<ProductFilterFormValues>();

  const user = useAppSelector((state) => state.user.user);

  if (!user) {
    return null;
  }

  const userId = user.id;
  const farmId = getValues('farmId');

  const { data: farms } = facilityDetailsApi.useGetAllByUserIdQuery(userId);

  const productTypesByFarmId = farms?.find((farm) => farm.id === farmId)?.productTypes || [];

  return (
    <>
      <div className="mt-6 flex gap-4 items-end">
        <FormField
          control={control}
          name="farmId"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>Farm</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value} disabled={!farms?.length}>
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

        <FormField
          control={control}
          name="productTypeId"
          render={({ field, fieldState }) => (
            <FormItem className="w-full">
              <FormControl>
                <ReactTags
                  isDisabled={!farms?.length || !farmId}
                  classNames={{
                    root: 'relative mt-8 min-h-10 cursor-text flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ',
                    rootIsActive: 'outline-none ring-2 ring-ring ring-offset-2',
                    rootIsDisabled: 'opacity-75 bg-gray-200 pointer-events-none cursor-not-allowed',
                    rootIsInvalid: '',
                    label: cn(
                      'absolute w-full -top-7 left-0 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 overflow-hidden',
                      fieldState.invalid && 'text-red-500'
                    ),
                    tagList: 'inline p-0',
                    tagListItem: 'inline list-none cursor-pointer',
                    tag: cn(
                      'tag group h-6 mx-1 px-1 border-0 rounded bg-gray-200 text-base',
                      (field.value?.length || 0) > 3 && 'mb-1'
                    ),
                    tagName: 'text-sm',
                    comboBox: 'inline-block p-[1px] max-w-full',
                    input: '!w-20 m-0 p-0 border-0 outline-none bg-transparent text-sm',
                    listBox:
                      'absolute z-10 top-full left-0 right-0 max-h-64 overflow-y-auto bg-white border border-gray-400 rounded shadow-lg cursor-pointer',
                    option: ' option py-2 px-2',
                    optionIsActive: 'hover:cursor-pointer hover:bg-gray-200',
                    highlight: 'bg-yellow-500'
                  }}
                  onBlur={field.onBlur}
                  labelText="Select farm products"
                  isInvalid={fieldState.invalid}
                  selected={
                    field.value?.map((item) => ({
                      label: productTypesByFarmId.find((product) => product.id === item)?.name as string,
                      value: item
                    })) || []
                  }
                  suggestions={productTypesByFarmId.map((productType) => ({
                    label: productType.name,
                    value: productType.id
                  }))}
                  onAdd={(tag) => {
                    const value = field.value || [];
                    field.onChange([...value, tag.value]);
                  }}
                  onDelete={(i) => {
                    const value = field.value || [];
                    const newTags = [...value];
                    newTags.splice(i, 1);
                    field.onChange(newTags);
                  }}
                  noOptionsText="No matching products"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex flex-col w-full">
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
