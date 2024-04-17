import { ComparisonOperator } from '@/lib/enums/comparison-operator.enum';
import { SortOrder } from '@/lib/enums/sort-order.enum';
import { compareValues } from '@/lib/helpers/compareValues';
import { DeliveryOrderStatus, DeliveryOrderStatusValues } from '@/lib/types/DeliveryOrder/DeliveryOrder.type';
import { DateRange, NumberRange, SortOrderValues } from '@/lib/types/types';
import { AnyObject, ObjectSchema, array, date, number, object, string } from 'yup';

export const deliveryOrderSortKeys = ['desiredPriceSort', 'desiredDateSort', 'deliveryOrderStatusSort'] as const;
export type DeliveryOrderSortKeys = (typeof deliveryOrderSortKeys)[number];
export const deliveryOrderSortKeyToLabelMap: Record<DeliveryOrderSortKeys, string> = {
  [deliveryOrderSortKeys[0]]: 'Desired price',
  [deliveryOrderSortKeys[1]]: 'Desired date',
  [deliveryOrderSortKeys[2]]: 'Status'
};

export type DeliveryOrderFilterFormValues = {
  limit?: number;
  offset?: number;
  productName?: string;
  desiredPrice?: NumberRange;
  desiredDate?: DateRange;
  deliveryOrderStatus?: DeliveryOrderStatusValues[];
  fromFarmLocation?: string;
  toDepotLocation?: string;
  desiredPriceSort?: SortOrderValues;
  desiredDateSort?: SortOrderValues;
  deliveryOrderStatusSort?: SortOrderValues;
  innerSortKey?: DeliveryOrderSortKeys;
  innerSortOrder?: SortOrderValues;
};

export const deliveryOrderFilterFormDefaultValues: DeliveryOrderFilterFormValues = {
  limit: 10,
  offset: 0,
  productName: '',
  desiredPrice: undefined,
  desiredDate: undefined,
  deliveryOrderStatus: [],
  fromFarmLocation: undefined,
  toDepotLocation: undefined,
  desiredPriceSort: undefined,
  desiredDateSort: undefined,
  deliveryOrderStatusSort: undefined,
  innerSortKey: undefined,
  innerSortOrder: SortOrder.ASC
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

export const useDeliveryOrderFilterFormSchema = (): ObjectSchema<
  DeliveryOrderFilterFormValues,
  AnyObject,
  {
    limit: undefined;
    offset: undefined;
    productName: undefined;
    desiredPrice: {
      from: undefined;
      to: undefined;
    };
    desiredDate: {
      from: undefined;
      to: undefined;
    };
    deliveryOrderStatus: undefined;
    fromFarmLocation: undefined;
    toDepotLocation: undefined;
    desiredPriceSort: undefined;
    desiredDateSort: undefined;
    deliveryOrderStatusSort: undefined;
    innerSortKey: undefined;
    innerSortOrder: undefined;
  },
  ''
> => {
  return object({
    limit: number(),
    offset: number().required(),
    productName: string(),
    desiredPrice: object(numberRangeObjectSchema).test(
      'desiredPrice',
      'Max desired price must be greater than min desired price',
      function (value, context) {
        const numberRange = value as NumberRange;
        if (!numberRange) {
          return true;
        }
        if (numberRange.from === undefined && numberRange?.to === undefined) {
          return true;
        }

        if (compareValues(numberRange.from, 0, ComparisonOperator.LESS_THAN_OR_EQUAL)) {
          return context.createError({ message: 'Min desired price must be greater than 0' });
        }
        if (compareValues(numberRange.to, 0, ComparisonOperator.LESS_THAN_OR_EQUAL)) {
          return context.createError({ message: 'Max desired price must be greater than 0' });
        }
        if (!numberRange?.from || !numberRange.to) {
          return true;
        }
        return compareValues(numberRange.from, numberRange.to, ComparisonOperator.LESS_THAN);
      }
    ),
    desiredDate: object(dateRangeObjectSchema).test(
      'desiredDate',
      'Min desired date must be less than max desired date',
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
    deliveryOrderStatus: array(
      string().oneOf<DeliveryOrderStatusValues>(Object.values(DeliveryOrderStatus)).required()
    ),
    fromFarmLocation: string(),
    toDepotLocation: string(),
    desiredPriceSort: string().oneOf<SortOrderValues>(['ASC', 'DESC']),
    desiredDateSort: string().oneOf<SortOrderValues>(['ASC', 'DESC']),
    deliveryOrderStatusSort: string().oneOf<SortOrderValues>(['ASC', 'DESC']),
    innerSortKey: string().oneOf<DeliveryOrderSortKeys>(deliveryOrderSortKeys),
    innerSortOrder: string().oneOf<SortOrderValues>(['ASC', 'DESC'])
  });
};
