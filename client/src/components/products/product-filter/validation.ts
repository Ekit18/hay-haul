import { SortOrderValues } from '@/lib/types/types';
import { AnyObject, ObjectSchema, array, number, object, ref, string } from 'yup';

export type ProductFilterFormValues = {
  searchQuery?: string;
  productTypeId?: string[];
  farmId?: string;
  minQuantity?: number;
  maxQuantity?: number;
  nameSort: SortOrderValues;
};

export const productFilterFormDefaultValues: ProductFilterFormValues = {
  searchQuery: '',
  productTypeId: [],
  farmId: '',
  minQuantity: 0,
  maxQuantity: 0,
  nameSort: 'ASC'
};

export const useProductFilterFormSchema = (): ObjectSchema<
  ProductFilterFormValues,
  AnyObject,
  {
    searchQuery: undefined;
    productTypeId: '';
    farmId: undefined;
    minQuantity: undefined;
    maxQuantity: undefined;
  },
  ''
> => {
  return object({
    nameSort: string().oneOf(['ASC', 'DESC']),
    searchQuery: string(),
    productTypeId: array().of(string().nonNullable().defined()),
    farmId: string(),
    minQuantity: number()
      .min(0, 'Min quantity must be greater than or equal to 0')
      .max(ref('maxQuantity'), 'Min quantity must be less than max quantity'),
    maxQuantity: number().min(ref('minQuantity'), 'Max quantity must be greater than min quantity')
  });
};
