import { cn } from '@/lib/utils';
import { ReactTags } from 'react-tag-autocomplete';

import { ProductType } from '@/lib/types/ProductType/ProductType.type';
import style from './styles.module.css';

interface EmptyTagInputProps {
  selected: ProductType[];
}

export function EmptyTagInput({ selected }: EmptyTagInputProps) {
  return (
    <>
      <ReactTags
        isDisabled
        classNames={{
          root: 'relative mt-8 min-h-10 cursor-text flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ',
          rootIsActive: 'outline-none ring-2 ring-ring ring-offset-2',
          rootIsDisabled: 'pointer-events-none cursor-not-allowed',
          rootIsInvalid: '',
          label: cn(
            'absolute w-full -top-7 left-0 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 overflow-hidden'
          ),
          tagList: 'inline p-0',
          tagListItem: 'inline list-none cursor-pointer',
          tag: cn('group h-6 mx-1 px-1 border-0 rounded bg-gray-200 text-base', (selected.length || 0) > 2 && 'mb-1'),
          tagName: 'text-sm',
          comboBox: 'hidden',
          input: '!w-20 m-0 p-0 border-0 outline-none bg-transparent text-sm',
          listBox:
            'absolute z-10 top-full left-0 right-0 max-h-64 overflow-y-auto bg-white border border-gray-400 rounded shadow-lg cursor-pointer',
          option: cn('py-2 px-2 hover:bg-gray-200 flex items-center', style.option),
          optionIsActive: 'hover:cursor-pointer hover:bg-gray-200',
          highlight: 'bg-yellow-500'
        }}
        labelText="Product types"
        onAdd={() => {}}
        onDelete={() => {}}
        suggestions={[]}
        selected={selected.map((item) => ({ value: item.name, label: item.name })) || []}
      />
    </>
  );
}
