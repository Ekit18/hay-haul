import { ComparisonOperator } from '@/lib/enums/comparison-operator.enum';
import { compareValues } from '@/lib/helpers/compareValues';
import { ProductAuctionStatus, ProductAuctionStatusValues } from '@/lib/types/ProductAuction/ProductAuction.type';
import { NumberRange, SortOrderValues } from '@/lib/types/types';
import { DateRange } from 'react-day-picker';
import { AnyObject, ObjectSchema, array, date, number, object, string } from 'yup';

export type ProductAuctionFilterFormValues = {
  limit?: number;
  offset?: number;
  productName?: string;
  startPrice?: NumberRange;
  buyoutPrice?: NumberRange;
  startDate?: DateRange;
  endDate?: DateRange;
  statuses?: ProductAuctionStatus[];
  quantity?: NumberRange;
  quantitySort?: SortOrderValues;
  endDateSort?: SortOrderValues;
  startDateSort?: SortOrderValues;
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
  statuses: undefined,
  quantitySort: undefined,
  endDateSort: undefined,
  startDateSort: undefined
};

export const dateRangeObjectSchema = {
  from: date().required(),
  to: date()
};
export const numberRangeObjectSchema = {
  from: number().required(),
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
      function (value) {
        const numberRange = value as NumberRange;
        if (!numberRange) {
          return true;
        }
        if (!numberRange.from || !numberRange?.to) {
          return true;
        }
        return compareValues(numberRange.from, numberRange.to, ComparisonOperator.LESS_THAN);
      }
    ),
    buyoutPrice: object(numberRangeObjectSchema).test(
      'buyoutPrice',
      'Max buyout price must be greater than min buyout price',
      function (value) {
        const numberRange = value as NumberRange;
        if (!numberRange) {
          return true;
        }
        if (!numberRange.from || !numberRange?.to) {
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
        if (!dateRange.from || !dateRange?.to) {
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
        if (!dateRange.from || !dateRange?.to) {
          return true;
        }
        return compareValues(dateRange.from, dateRange.to, ComparisonOperator.LESS_THAN);
      }
    ),
    quantity: object(numberRangeObjectSchema).test('minQuantity', function (value) {
      const numberRange = value as NumberRange;
      if (!numberRange) {
        return true;
      }
      if (!numberRange.from || !numberRange?.to) {
        return true;
      }
      return compareValues(numberRange.from, numberRange.to, ComparisonOperator.LESS_THAN);
    }),
    statuses: array(string().oneOf<ProductAuctionStatusValues>(Object.values(ProductAuctionStatus)).required()),
    endDateSort: string().oneOf<SortOrderValues>(['ASC', 'DESC']),
    startDateSort: string().oneOf<SortOrderValues>(['ASC', 'DESC']),
    quantitySort: string().oneOf<SortOrderValues>(['ASC', 'DESC'])
  });
};
