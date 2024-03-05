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
  offset: number;
  limit?: number;
};

export const productFilterFormDefaultValues: ProductFilterFormValues = {
  searchQuery: '',
  productTypeId: [],
  farmId: '',
  minQuantity: 0,
  maxQuantity: 0,
  nameSort: undefined,
  quantitySort: undefined,
  productTypeSort: undefined,
  offset: 0,
  limit: 10
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
    offset: undefined;
    limit: undefined;
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
    quantitySort: string().oneOf<SortOrderValues>(['ASC', 'DESC']),
    offset: number().required(),
    limit: number()
  });
};
