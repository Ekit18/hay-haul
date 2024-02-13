import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { useFormContext } from 'react-hook-form';
import { ReactTags } from 'react-tag-autocomplete';
import { SignUpFormValues } from '../validation';
import { farmProductTypesSuggestions } from './farmProductTypesSuggestions';
import './styles.css';

export function FacilityForm() {
  const { control } = useFormContext<SignUpFormValues>();

  return (
    <div className="w-full h-full gap-4 flex flex-col">
      <FormField
        control={control}
        name="farmProductTypes"
        render={({ field, fieldState }) => (
          <FormItem className="w-full">
            <FormControl>
              <ReactTags
                classNames={{
                  root: 'relative mt-8 min-h-10 cursor-text flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ',
                  rootIsActive: 'outline-none ring-2 ring-ring ring-offset-2',
                  rootIsDisabled: 'opacity-75 bg-gray-200 pointer-events-none cursor-not-allowed',
                  rootIsInvalid: '',
                  label: cn(
                    'absolute w-full -top-7 left-0 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 overflow-hidden',
                    fieldState.invalid && 'text-red-500'
                  ),
                  tagList: 'inline p-0',
                  tagListItem: 'inline list-none cursor-pointer',
                  tag: cn(
                    'tag group h-6 mx-1 px-1 border-0 rounded bg-gray-200 text-base',
                    (field.value?.length || 0) > 3 && 'mb-1'
                  ),
                  tagName: 'text-sm',
                  comboBox: 'inline-block p-[1px] max-w-full',
                  input: '!w-20 m-0 p-0 border-0 outline-none bg-transparent text-sm',
                  listBox:
                    'absolute z-10 top-full left-0 right-0 max-h-64 overflow-y-auto bg-white border border-gray-400 rounded shadow-lg cursor-pointer',
                  option: ' option py-2 px-2',
                  optionIsActive: 'hover:cursor-pointer hover:bg-gray-200',
                  highlight: 'bg-yellow-500'
                }}
                onBlur={field.onBlur}
                labelText="Select farm products"
                isInvalid={fieldState.invalid}
                selected={field.value?.map((item) => ({ label: item, value: item })) || []}
                suggestions={farmProductTypesSuggestions}
                onAdd={(tag) => {
                  const value = field.value || [];
                  field.onChange([...value, tag.value]);
                }}
                onDelete={(i) => {
                  const value = field.value || [];
                  const newTags = [...value];
                  newTags.splice(i, 1);
                  field.onChange(newTags);
                }}
                allowNew
                noOptionsText="No matching products"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

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
