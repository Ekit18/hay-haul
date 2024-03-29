import { NonTypeKeys } from '@/lib/types/types';
import React from 'react';
import { FieldValues, Path, useFormContext } from 'react-hook-form';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from './form';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from './select';

export type FilterSelectInputProps<T extends FieldValues, K extends Array<unknown>> = {
  title: string;
  fieldName: Path<T>;
  placeholder: string;
  values?: K;
  valueProperty?: K[number] extends object
    ? K[number] extends { id: string }
      ? NonTypeKeys<K[number], object>
      : never
    : never;
  containerClassName?: string;
};

export function FilterSelect<T extends FieldValues, K extends Array<unknown>>({
  fieldName,
  title,
  values,
  placeholder,
  valueProperty,
  containerClassName
}: FilterSelectInputProps<T, K>) {
  const { control } = useFormContext<T>();

  return (
    <div className={containerClassName}>
      <FormField
        control={control}
        name={fieldName}
        render={({ field }) => (
          <FormItem className="w-full">
            <FormLabel>{title}</FormLabel>
            <Select onValueChange={field.onChange} value={field.value} disabled={!values?.length}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder={placeholder} />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectGroup>
                  {values?.map((item: K[number]) => {
                    let value: string | number | null = null;
                    let key: string = '';
                    // TODO: refactor this
                    if (valueProperty && typeof item === 'object' && item !== null && valueProperty in item) {
                      const itemValue = item[valueProperty];
                      value = itemValue as string | number;

                      key = 'id' in item ? (item.id as string) : (itemValue as string);
                    } else if (typeof item !== 'object') {
                      value = item as string | number;
                    }

                    return (
                      <SelectItem key={key} value={key?.toString() || ''}>
                        {value as React.ReactNode}
                      </SelectItem>
                    );
                  })}
                </SelectGroup>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
