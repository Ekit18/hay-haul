import { SortOrderValues } from '@/lib/types/types';
import { AnyObject, ObjectSchema, array, number, object, ref, string } from 'yup';

export type ProductFilterFormValues = {
  searchQuery?: string;
  productTypeId?: string[];
  farmId?: string;
  minQuantity?: number;
  maxQuantity?: number;
  nameSort?: SortOrderValues;
  quantitySort?: SortOrderValues;
  productTypeSort?: SortOrderValues;
};

export const productFilterFormDefaultValues: ProductFilterFormValues = {
  searchQuery: '',
  productTypeId: [],
  farmId: '',
  minQuantity: 0,
  maxQuantity: 0,
  nameSort: 'DESC',
  quantitySort: 'DESC',
  productTypeSort: 'DESC'
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
    nameSort: undefined;
    productTypeSort: undefined;
    quantitySort: undefined;
  },
  ''
> => {
  return object({
    searchQuery: string(),
    productTypeId: array().of(string().nonNullable().defined()),
    farmId: string(),
    minQuantity: number()
      .min(0, 'Min quantity must be greater than or equal to 0')
      .max(ref('maxQuantity'), 'Min quantity must be less than max quantity'),
    maxQuantity: number().min(ref('minQuantity'), 'Max quantity must be greater than min quantity'),
    nameSort: string().oneOf<SortOrderValues>(['ASC', 'DESC']),
    productTypeSort: string().oneOf<SortOrderValues>(['ASC', 'DESC']),
    quantitySort: string().oneOf<SortOrderValues>(['ASC', 'DESC'])
  });
};
