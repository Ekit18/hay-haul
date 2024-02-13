import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { PasswordInput } from '@/components/ui/password-input';
import { useFormContext } from 'react-hook-form';
import { ResetPasswordFormValues } from '../validation';

export function InputPasswordWithConfirm() {
  const { control } = useFormContext<ResetPasswordFormValues>();

  return (
    <div className="w-full h-full">
      <FormField
        control={control}
        name="password"
        render={({ field }) => (
          <FormItem className="w-full">
            <FormLabel htmlFor="password">New password</FormLabel>
            <FormControl>
              <PasswordInput {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="confirmPassword"
        render={({ field }) => (
          <FormItem className="w-full">
            <FormLabel htmlFor="confirmPassword">Confirm password</FormLabel>
            <FormControl>
              <PasswordInput {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
