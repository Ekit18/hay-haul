import { NumberRange, NumberRangeFields } from '@/lib/types/types';
import { FieldValues, Path, useFormContext } from 'react-hook-form';
import { FormControl, FormField, FormItem, FormMessage } from './form';
import { Input } from './input';

export type NumberInputWithRangeInputProps<T extends FieldValues, K extends Path<NumberRangeFields<T>>> = {
  title: string;
  fieldName: K;
};
export function NumberInputWithRange<T extends FieldValues, K extends Path<NumberRangeFields<T>>>({
  title,
  fieldName
}: NumberInputWithRangeInputProps<T, K>) {
  const { control, watch } = useFormContext<T>();
  const currentValue = watch(fieldName);
  return (
    <div className="flex w-full flex-col justify-end">
      <p className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
        {title}
      </p>
      <div className="mt-3 grid grid-cols-[1fr_min-content_1fr] text-center">
        <FormField
          control={control}
          name={fieldName}
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input
                  className="w-full"
                  placeholder="Min"
                  {...field}
                  onBlur={(e) => {
                    if (e.target.value === '') {
                      field.onChange({ ...currentValue, from: undefined });
                      return;
                    }
                  }}
                  onChange={(e) => {
                    if (Number.isNaN(e.target.valueAsNumber)) {
                      field.onChange({ ...currentValue, from: undefined });
                      return;
                    }
                    if (e.target.valueAsNumber <= 0) {
                      return;
                    }
                    field.onChange({ ...currentValue, from: e.target.valueAsNumber });
                  }}
                  value={(field.value as NumberRange)?.from || ''}
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
          name={fieldName}
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input
                  className="w-full"
                  placeholder="Max"
                  {...field}
                  onBlur={(e) => {
                    if (e.target.value === '') {
                      field.onChange({ ...currentValue, to: undefined });
                      return;
                    }
                  }}
                  onChange={(e) => {
                    if (Number.isNaN(e.target.valueAsNumber)) {
                      field.onChange({ ...currentValue, to: undefined });
                      return;
                    }
                    if (e.target.valueAsNumber <= 0) {
                      return;
                    }
                    field.onChange({ ...currentValue, to: e.target.valueAsNumber });
                  }}
                  value={(field.value as NumberRange)?.to || ''}
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
