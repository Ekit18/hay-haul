import { ComparisonOperator } from '@/lib/enums/comparison-operator.enum';
import { compareValues } from '@/lib/helpers/compareValues';
import { ProductAuctionStatus, ProductAuctionStatusValues } from '@/lib/types/ProductAuction/ProductAuction.type';
import { DateRange, NumberRange, SortOrderValues } from '@/lib/types/types';
import { AnyObject, ObjectSchema, array, date, number, object, string } from 'yup';

export const productAuctionSortKeys = ['quantitySort', 'endDateSort', 'startDateSort'] as const;
export type ProductAuctionSortKeys = (typeof productAuctionSortKeys)[number];
export const productAuctionSortKeyToLabelMap: Record<ProductAuctionSortKeys, string> = {
  [productAuctionSortKeys[0]]: 'Quantity',
  [productAuctionSortKeys[1]]: 'End date',
  [productAuctionSortKeys[2]]: 'Start date'
};
export type ProductAuctionFilterFormValues = {
  limit?: number;
  offset?: number;
  productName?: string;
  startPrice?: NumberRange;
  buyoutPrice?: NumberRange;
  startDate?: DateRange;
  endDate?: DateRange;
  statuses?: ProductAuctionStatusValues[];
  quantity?: NumberRange;
  quantitySort?: SortOrderValues;
  endDateSort?: SortOrderValues;
  startDateSort?: SortOrderValues;
  innerSortKey?: ProductAuctionSortKeys;
  innerSortOrder?: SortOrderValues;
};

export const productAuctionFilterFormDefaultValues: ProductAuctionFilterFormValues = {
  limit: 10,
  offset: 0,
  productName: '',
  startPrice: undefined,
  buyoutPrice: undefined,
  startDate: undefined,
  endDate: undefined,
  quantity: undefined,
  statuses: [],
  quantitySort: undefined,
  endDateSort: undefined,
  startDateSort: undefined,
  innerSortKey: undefined,
  innerSortOrder: undefined
};

export const dateRangeRequiredObjectSchema = {
  from: date().required('Start date is required'),
  to: date().required('End date is required')
};

export const dateRangeObjectSchema = {
  from: date(),
  to: date()
};
export const numberRangeObjectSchema = {
  from: number(),
  to: number()
};

export const useProductAuctionFilterFormSchema = (): ObjectSchema<
  ProductAuctionFilterFormValues,
  AnyObject,
  {
    limit: undefined;
    offset: undefined;
    productName: undefined;
    startPrice: {
      from: undefined;
      to: undefined;
    };
    buyoutPrice: {
      from: undefined;
      to: undefined;
    };
    startDate: {
      from: undefined;
      to: undefined;
    };
    endDate: {
      from: undefined;
      to: undefined;
    };
    quantity: {
      from: undefined;
      to: undefined;
    };
    quantitySort: undefined;
    endDateSort: undefined;
    startDateSort: undefined;
    statuses: undefined;
    innerSortKey: undefined;
    innerSortOrder: undefined;
  },
  ''
> => {
  return object({
    limit: number(),
    offset: number().required(),
    productName: string(),
    startPrice: object(numberRangeObjectSchema).test(
      'startPrice',
      'Max start price must be greater than min start price',
      function (value, context) {
        const numberRange = value as NumberRange;
        if (!numberRange) {
          return true;
        }
        if (numberRange.from === undefined && numberRange?.to === undefined) {
          return true;
        }
        console.log('here');
        if (compareValues(numberRange.from, 0, ComparisonOperator.LESS_THAN_OR_EQUAL)) {
          return context.createError({ message: 'Min start price must be greater than 0' });
        }
        if (compareValues(numberRange.to, 0, ComparisonOperator.LESS_THAN_OR_EQUAL)) {
          return context.createError({ message: 'Max start price must be greater than 0' });
        }
        if (!numberRange?.from || !numberRange.to) {
          return true;
        }
        return compareValues(numberRange.from, numberRange.to, ComparisonOperator.LESS_THAN);
      }
    ),
    buyoutPrice: object(numberRangeObjectSchema).test(
      'buyoutPrice',
      'Max buyout price must be greater than min buyout price',
      function (value, context) {
        const numberRange = value as NumberRange;
        if (!numberRange) {
          return true;
        }
        if (numberRange.from === undefined && numberRange?.to === undefined) {
          return true;
        }
        if (compareValues(numberRange.from, 0, ComparisonOperator.LESS_THAN_OR_EQUAL)) {
          return context.createError({ message: 'Min buyout price must be greater than 0' });
        }
        if (compareValues(numberRange.to, 0, ComparisonOperator.LESS_THAN_OR_EQUAL)) {
          return context.createError({ message: 'Max buyout price must be greater than 0' });
        }
        if (!numberRange?.from || !numberRange.to) {
          return true;
        }
        return compareValues(numberRange.from, numberRange.to, ComparisonOperator.LESS_THAN);
      }
    ),
    startDate: object(dateRangeObjectSchema).test(
      'startDate',
      'Min start date must be less than max start date',
      function (value) {
        const dateRange = value as DateRange;
        if (!dateRange) {
          return true;
        }
        if (dateRange.from === undefined && dateRange?.to === undefined) {
          return true;
        }
        if (!dateRange?.from || !dateRange.to) {
          return true;
        }
        return compareValues(dateRange.from, dateRange.to, ComparisonOperator.LESS_THAN);
      }
    ),
    endDate: object(dateRangeObjectSchema).test(
      'endDate',
      'Min end date must be less than max end date',
      function (value) {
        const dateRange = value as DateRange;
        if (!dateRange) {
          return true;
        }
        if (dateRange.from === undefined && dateRange?.to === undefined) {
          return true;
        }
        if (!dateRange?.from || !dateRange.to) {
          return true;
        }
        return compareValues(dateRange.from, dateRange.to, ComparisonOperator.LESS_THAN);
      }
    ),
    quantity: object(numberRangeObjectSchema).test(
      'minQuantity',
      'Max quantity must be greater than min quantity',
      function (value, context) {
        const numberRange = value as NumberRange;
        if (!numberRange) {
          return true;
        }
        if (numberRange.from === undefined && numberRange?.to === undefined) {
          return true;
        }
        if (compareValues(numberRange.from, 0, ComparisonOperator.LESS_THAN_OR_EQUAL)) {
          return context.createError({ message: 'Min quantity price must be greater than 0' });
        }
        if (compareValues(numberRange.to, 0, ComparisonOperator.LESS_THAN_OR_EQUAL)) {
          return context.createError({ message: 'Max quantity price must be greater than 0' });
        }
        if (!numberRange?.from || !numberRange.to) {
          return true;
        }
        return compareValues(numberRange.from, numberRange.to, ComparisonOperator.LESS_THAN);
      }
    ),
    statuses: array(string().oneOf<ProductAuctionStatusValues>(Object.values(ProductAuctionStatus)).required()),
    endDateSort: string().oneOf<SortOrderValues>(['ASC', 'DESC']),
    startDateSort: string().oneOf<SortOrderValues>(['ASC', 'DESC']),
    quantitySort: string().oneOf<SortOrderValues>(['ASC', 'DESC']),
    innerSortKey: string().oneOf<ProductAuctionSortKeys>(['quantitySort', 'endDateSort', 'startDateSort']),
    innerSortOrder: string().oneOf<SortOrderValues>(['ASC', 'DESC'])
  });
};
