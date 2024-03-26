import { useFormContext } from 'react-hook-form';
import { FormControl, FormField, FormItem, FormMessage } from './form';
import { Input } from './input';

// TODO: stopped here. Must make type safety and end useFormContext
export type NumberInputWithRangeInputProps = {};
export function NumberInputWithRange({ title, fieldName }: { title: string; fieldName: string }) {
  const { control, trigger } = useFormContext();
  return (
    <div className="flex flex-col w-full justify-end">
      <p className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
        {title}
      </p>
      <div className="flex mt-3">
        <FormField
          control={control}
          name={fieldName}
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
          name="maxStartPrice"
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
  );
}
