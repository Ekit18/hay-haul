import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useFormContext } from 'react-hook-form';
import { SignUpFormValues } from '../validation';

export function ChoseRole() {
  const { control } = useFormContext<SignUpFormValues>();

  return (
    <div className="w-full h-full">
      <FormField
        control={control}
        name="role"
        render={({ field }) => (
          <FormItem className="space-y-3">
            <FormControl>
              <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex flex-col space-y-1">
                <FormItem className="flex flex-col items-start space-x-3 space-y-0 gap-2 border p-2 rounded border-secondary">
                  <div className="flex gap-2">
                    <FormControl>
                      <RadioGroupItem value="farmer" />
                    </FormControl>
                    <FormLabel className="font-normal">Farmer</FormLabel>
                  </div>
                  <FormDescription>Sell farm production to customers who need it</FormDescription>
                </FormItem>
                <FormItem className="flex flex-col items-start space-x-3 space-y-0 gap-2 border p-2 rounded border-secondary">
                  <div className="flex gap-2">
                    <FormControl>
                      <RadioGroupItem value="carrier" />
                    </FormControl>
                    <FormLabel className="font-normal">Carrier</FormLabel>
                  </div>
                  <FormDescription>
                    I have a transportation company, and i want to offer transportation services
                  </FormDescription>
                </FormItem>
                <FormItem className="flex flex-col items-start space-x-3 space-y-0 gap-2 border p-2 rounded border-secondary">
                  <div className="flex gap-2">
                    <FormControl>
                      <RadioGroupItem value="Businessman" />
                    </FormControl>
                    <FormLabel className="font-normal">Businessman</FormLabel>
                  </div>
                  <FormDescription>Searching for farmer production and want to buy it</FormDescription>
                </FormItem>
              </RadioGroup>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
