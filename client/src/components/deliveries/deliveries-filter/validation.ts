import { SortOrder } from '@/lib/enums/sort-order.enum';
import { DeliveryStatus, DeliveryStatusValues } from '@/lib/types/Delivery/Delivery.type';
import { SortOrderValues } from '@/lib/types/types';
import { AnyObject, ObjectSchema, array, date, number, object, string } from 'yup';

export const deliveriesSortKeys = ['statusSort'] as const;
export type DeliveriesSortKeys = (typeof deliveriesSortKeys)[number];
export const deliveriesSortKeyToLabelMap: Record<DeliveriesSortKeys, string> = {
  [deliveriesSortKeys[0]]: 'Status'
};

export type DeliveriesFilterFormValues = {
  limit?: number;
  offset?: number;
  productName?: string;
  transportId?: string;
  driverId?: string;
  deliveriesStatus?: DeliveryStatusValues[];
  deliveriesStatusSort?: SortOrderValues;
  innerSortKey?: DeliveriesSortKeys;
  innerSortOrder?: SortOrderValues;
};

export const deliveriesFilterFormDefaultValues: DeliveriesFilterFormValues = {
  limit: 10,
  offset: 0,
  productName: '',
  transportId: undefined,
  driverId: undefined,
  deliveriesStatus: [],
  deliveriesStatusSort: undefined,
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

export const useDeliveriesFilterFormSchema = (): ObjectSchema<
  DeliveriesFilterFormValues,
  AnyObject,
  {
    limit: undefined,
    offset: undefined,
    productName: undefined,
    transportId: undefined,
    driverId: undefined,
    deliveriesStatus: undefined,
    deliveriesStatusSort: undefined,
    innerSortKey: undefined,
    innerSortOrder: undefined
  },
  ''
> => {
  return object({
    limit: number(),
    offset: number().required(),
    productName: string(),
    transportId: string(),
    driverId: string(),
    deliveriesStatus: array(
      string().oneOf<DeliveryStatusValues>(Object.values(DeliveryStatus)).required()
    ),
    deliveriesStatusSort: string().oneOf<SortOrderValues>(['ASC', 'DESC']),
    innerSortKey: string().oneOf<DeliveriesSortKeys>(deliveriesSortKeys),
    innerSortOrder: string().oneOf<SortOrderValues>(['ASC', 'DESC'])
  });
};
