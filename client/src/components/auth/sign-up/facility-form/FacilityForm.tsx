import { TagInput } from '@/components/tag-input/TagInput';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { UserRole } from '@/lib/enums/user-role.enum';
import { useFormContext } from 'react-hook-form';
import { SignUpFormValues } from '../validation';
import { farmProductTypesSuggestions } from './farmProductTypesSuggestions';

export function FacilityForm() {
  const { control, watch } = useFormContext<SignUpFormValues>();

  const selectedRole = watch('role');

  return (
    <div className="flex h-full w-full flex-col gap-4">
      {selectedRole === UserRole.Farmer && (
        <TagInput
          name="farmProductTypes"
          control={control}
          suggestions={farmProductTypesSuggestions}
          labelText="Select farm products"
          noOptionsText="No matching products"
          allowNew
          selectedFn={(item) => ({ value: item, label: item })}
        />
      )}

      <FormField
        control={control}
        name="facilityName"
        render={({ field }) => (
          <FormItem className="w-full">
            <FormLabel htmlFor="facilityName">Facility name</FormLabel>
            <FormControl>
              <Input placeholder="Enter your facility name" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="facilityAddress"
        render={({ field }) => (
          <FormItem className="w-full">
            <FormLabel htmlFor="facilityAddress">Facility address</FormLabel>
            <FormControl>
              <Input placeholder="Enter your facility address" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="facilityOfficialCode"
        render={({ field }) => (
          <FormItem className="w-full">
            <FormLabel htmlFor="facilityOfficialCode">Facility official code</FormLabel>
            <FormControl>
              <Input placeholder="Enter you facility official code" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
