import { Button } from '@/components/ui/button';
import { Input, InputProps } from '@/components/ui/input';
import { DEBOUNCE_DELAY } from '@/lib/constants/constants';
import { cn } from '@/lib/utils';
import libraryDebounce from 'debounce';
import { Search } from 'lucide-react';
import { forwardRef, useEffect, useState } from 'react';

interface SearchInputProps extends Omit<InputProps, 'onChange'> {
  onChange: (value: string) => void;
}

const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(({ className, onChange, ...props }, ref) => {
  const disabled = props.value === '' || props.value === undefined || props.disabled;

  const [value, setValue] = useState<string | undefined>(undefined);

  useEffect(() => {
    const debouncedOnValueChange = libraryDebounce(() => {
      if (value === undefined) return;
      onChange(value);
    }, DEBOUNCE_DELAY);

    debouncedOnValueChange();

    return () => {
      debouncedOnValueChange.clear();
    };
  }, [value, onChange]);

  useEffect(() => {
    if (!props.value) return setValue(undefined);
    setValue(props.value as string);
  }, [props.value]);

  return (
    <div className="relative">
      <Input
        type="text"
        className={cn('hide-password-toggle pr-10', className)}
        ref={ref}
        {...props}
        onChange={(e) => setValue(e.target.value)}
        value={value || ''}
      />
      <Button
        type="submit"
        size="sm"
        className="absolute right-0 top-0 rounded-l-none h-full px-3 py-2 "
        disabled={disabled}
      >
        <Search />
      </Button>
    </div>
  );
});
SearchInput.displayName = 'SearchInput';

export { SearchInput };
