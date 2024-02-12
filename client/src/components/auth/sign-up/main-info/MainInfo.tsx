import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useFormContext } from 'react-hook-form';
import { SignUpFormValues } from '../validation';

export function MainInfo() {
  const { control } = useFormContext<SignUpFormValues>();

  return (
    <div className="w-full h-full">
      <FormField
        control={control}
        name="fullName"
        render={({ field }) => (
          <FormItem className="w-full">
            <FormLabel htmlFor="fullname">Full name</FormLabel>
            <FormControl>
              <Input placeholder="Please write your full name" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
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
      <FormField
        control={control}
        name="password"
        render={({ field }) => (
          <FormItem className="w-full">
            <FormLabel htmlFor="password">Password</FormLabel>
            <FormControl>
              <Input placeholder="Enter you password" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
