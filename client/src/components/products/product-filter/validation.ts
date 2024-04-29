import { ComparisonOperator } from '@/lib/enums/comparison-operator.enum';
import { compareValues } from '@/lib/helpers/compareValues';
import { SortOrderValues } from '@/lib/types/types';
import { AnyObject, ObjectSchema, array, number, object, string } from 'yup';

export type ProductFilterFormValues = {
  searchQuery?: string;
  productTypeId?: string[];
  facilityId?: string;
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
  facilityId: '',
  minQuantity: 0,
  maxQuantity: 0,
  nameSort: undefined,
  quantitySort: undefined,
  productTypeSort: undefined,
  offset: 0,
  limit: 0
};

export const useProductFilterFormSchema = (): ObjectSchema<
  ProductFilterFormValues,
  AnyObject,
  {
    searchQuery: undefined;
    productTypeId: '';
    facilityId: undefined;
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
    facilityId: string(),
    minQuantity: number().test('minQuantity', 'Min quantity must be less than max quantity', function (value, context) {
      const { maxQuantity } = this.parent;
      if (!value) {
        return true;
      }
      if (compareValues(value, 0, ComparisonOperator.LESS_THAN_OR_EQUAL)) {
        return context.createError({ message: 'Min quantity must be greater than 0' });
      }
      return compareValues(value, maxQuantity, ComparisonOperator.LESS_THAN_OR_EQUAL);
    }),
    maxQuantity: number().test(
      'maxQuantity',
      'Max quantity must be greater than min quantity',
      function (value, context) {
        const { minQuantity } = this.parent;
        if (!value) {
          return true;
        }
        if (compareValues(value, 0, ComparisonOperator.LESS_THAN_OR_EQUAL)) {
          return context.createError({ message: 'Max quantity must be greater than 0' });
        }
        return compareValues(value, minQuantity, ComparisonOperator.GREATER_THAN_OR_EQUAL);
      }
    ),
    nameSort: string().oneOf<SortOrderValues>(['ASC', 'DESC']),
    productTypeSort: string().oneOf<SortOrderValues>(['ASC', 'DESC']),
    quantitySort: string().oneOf<SortOrderValues>(['ASC', 'DESC']),
    offset: number().required(),
    limit: number()
  });
};
