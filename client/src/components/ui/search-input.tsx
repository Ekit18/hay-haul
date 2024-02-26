import { Button } from '@/components/ui/button';
import { Input, InputProps } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { Search } from 'lucide-react';
import { forwardRef } from 'react';

const SearchInput = forwardRef<HTMLInputElement, InputProps>(({ className, ...props }, ref) => {
  const disabled = props.value === '' || props.value === undefined || props.disabled;

  return (
    <div className="relative">
      <Input type="text" className={cn('hide-password-toggle pr-10', className)} ref={ref} {...props} />
      <Button
        type="button"
        size="sm"
        className="absolute right-0 top-0 rounded-l-none h-full px-3 py-2 hover:bg-transparent"
        disabled={disabled}
      >
        <Search />
      </Button>
    </div>
  );
});
SearchInput.displayName = 'SearchInput';

export { SearchInput };
