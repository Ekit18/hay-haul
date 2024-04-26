import { DeepKey, DeepValue, NonTypeKeys } from '@/lib/types/types';
import React from 'react';
import { FieldValues, Path, useFormContext } from 'react-hook-form';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from './form';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from './select';
import pick from 'lodash.pick';
import get from 'lodash.get';

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
  disabled?: boolean;
  label?: K[number] extends object ? never : K[number];
  labelProperty?: DeepKey<K[number]> | DeepKey<K[number]>[];
  containerClassName?: string;
};

export function FilterSelect<T extends FieldValues, K extends Array<unknown>>({
  fieldName,
  title,
  values,
  placeholder,
  valueProperty,
  labelProperty,
  containerClassName,
  disabled
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
            <Select onValueChange={field.onChange} value={field.value} disabled={!values?.length || disabled}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder={placeholder} />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectGroup>
                  {values?.map((item: K[number]) => {
                    let value: string | number | null = null;
                    let label: string | number | null = null;

                    let key: string = '';

                    if (valueProperty && typeof item === 'object' && item !== null && valueProperty in item) {
                      const itemValue = item[valueProperty];
                      value = itemValue as string | number;
                      label = value;
                      if (labelProperty) {
                        let itemLabel = null;
                        if (labelProperty instanceof Array) {
                          itemLabel = labelProperty.reduce((res, property) => {
                            return `${res}${get(item, property, property) as unknown as string}`;
                          }, '');
                        } else {
                          itemLabel = get(item, labelProperty, '') as unknown as string;
                        }

                        label = itemLabel;
                      }
                      key = 'id' in item ? (item.id as string) : (itemValue as string);
                    } else if (typeof item !== 'object') {
                      value = item as string | number;
                      label = value;
                      key = item as string;
                    }
                    return (
                      <SelectItem key={key} value={key?.toString() || ''}>
                        {typeof label === 'object' ? '' : (label as React.ReactNode)}
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

// function getValueFromPath(obj, path) {
//   return path.split('.').reduce((o, k) => (o || {})[k], obj);
// }
