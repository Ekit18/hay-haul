import { FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { ArrayFields } from '@/lib/types/types';
import { cn } from '@/lib/utils';
import { Control, FieldValues, Path } from 'react-hook-form';
import { ReactTags, TagSuggestion } from 'react-tag-autocomplete';
import style from './styles.module.css';

interface TagInputProps<T extends FieldValues> {
  suggestions: TagSuggestion[];
  name: Path<ArrayFields<T>>;
  control: Control<T, unknown, T>;
  noOptionsText: string;
  labelText: string;
  allowNew: boolean;
}

export function TagInput<T extends FieldValues>({
  suggestions,
  name,
  control,
  allowNew,
  labelText,
  noOptionsText
}: TagInputProps<T>) {
  return (
    <>
      <FormField
        control={control}
        name={name}
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
                    'group h-6 mx-1 px-1 border-0 rounded bg-gray-200 text-base',
                    ((field.value as string[])?.length || 0) > 2 && 'mb-1',
                    style.tag
                  ),
                  tagName: 'text-sm',
                  comboBox: 'inline-block p-[1px] max-w-full',
                  input: '!w-20 m-0 p-0 border-0 outline-none bg-transparent text-sm',
                  listBox:
                    'absolute z-10 top-full left-0 right-0 max-h-64 overflow-y-auto bg-white border border-gray-400 rounded shadow-lg cursor-pointer',
                  option: cn('py-2 px-2 hover:bg-gray-200 flex items-center', style.option),
                  optionIsActive: 'hover:cursor-pointer hover:bg-gray-200',
                  highlight: 'bg-yellow-500'
                }}
                labelText={labelText}
                isInvalid={fieldState.invalid}
                selected={(field.value as string[]).map((item) => ({ label: item, value: item })) || []}
                suggestions={suggestions}
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
                allowNew={allowNew}
                noOptionsText={noOptionsText}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
}
