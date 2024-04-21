import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { DateRangeFields } from '@/lib/types/types';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { enUS } from 'date-fns/locale';
import { CalendarIcon } from 'lucide-react';
import { DateRange } from 'react-day-picker';
import { Controller, FieldValues, Path, useFormContext } from 'react-hook-form';
import { DropdownCalendar } from './dropdown-calendar';
import { ClassNameValue } from 'tailwind-merge';

const HIGHEST_YEAR = 2100;
const LOWEST_YEAR = 1900;

interface DatePickerWithRangeProps<T extends FieldValues, K extends Path<DateRangeFields<T>>> {
  field: K;
  title?: string;
  disabled?: boolean;
  className?: ClassNameValue;
}

export function DatePickerWithRange<T extends FieldValues, K extends Path<DateRangeFields<T>>>({
  field,
  title,
  disabled = false,
  className
}: DatePickerWithRangeProps<T, K>) {
  const {
    control,
    watch,
    formState: { errors }
  } = useFormContext();

  // TODO: non-typesafe field. Its type must be inferred from
  const date: DateRange = watch(field);
  return (
    <Popover>
      <PopoverTrigger
        asChild
        className="col-span-2 h-10 rounded-md rounded-r-none border border-input border-r-secondary font-normal sm:col-span-1 sm:border-r-[1px] lg:col-span-1"
      >
        <Button
          variant="outline"
          disabled={disabled}
          className={cn(
            'mb-[1px] flex h-auto w-full flex-row items-center justify-start bg-popover px-4 py-2 text-start last-of-type:rounded-l-none last-of-type:rounded-r-md last-of-type:border-l-0 last-of-type:border-r-input sm:mb-0 xl:odd:border-r-[1px]',
            !!errors[field] && 'shadow-[inset_0px_0px_8px_0px_#ff0000]',
            className
          )}
        >
          <div className="flex w-full flex-col justify-between">
            {title && <p className="text-gray-400">{title}</p>}
            <p className="overflow-hidden text-clip whitespace-nowrap text-black dark:text-white">
              {date ? (
                <>
                  <span>{!!date.from && format(date.from, 'd MMMM, yyyy', { locale: enUS })}</span>
                  <span>—</span>
                  <span>{!!date?.to && format(date.to, 'd MMMM, yyyy', { locale: enUS })}</span>
                </>
              ) : (
                <span>Pick date range</span>
              )}
            </p>
          </div>
          <CalendarIcon className="ml-auto hidden h-5 w-5 text-secondary xl:block" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Controller
          control={control}
          name={field}
          render={({ field }) => (
            <DropdownCalendar
              fromYear={LOWEST_YEAR}
              toYear={HIGHEST_YEAR}
              captionLayout="dropdown-buttons"
              mode="range"
              selected={field.value}
              onSelect={field.onChange}
              initialFocus
            />
          )}
        />
      </PopoverContent>
    </Popover>
  );
}
