import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useFormContext } from 'react-hook-form';
import { ResetPasswordFormValues } from '../validation';

export function InputEmail() {
  const { control } = useFormContext<ResetPasswordFormValues>();

  return (
    <div className="w-full h-full">
      <FormField
        control={control}
        name="email"
        render={({ field }) => (
          <FormItem className="w-full">
            <FormLabel htmlFor="email">Email</FormLabel>
            <FormControl>
              <Input placeholder="Enter your email" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
