import { ProductAuctionStatus } from '@/lib/types/ProductAuction/ProductAuction.type';
import { SortOrderValues } from '@/lib/types/types';
import { AnyObject, ObjectSchema, number, object, string } from 'yup';

export type ProductAuctionFilterFormValues = {
  limit?: number;
  offset?: number;
  productName?: string;
  minStartPrice?: number;
  maxStartPrice?: number;
  minBuyoutPrice?: number;
  maxBuyoutPrice?: number;
  minStartDate?: Date;
  maxStartDate?: Date;
  minEndDate?: Date;
  maxEndDate?: Date;
  statuses?: ProductAuctionStatus[];
  minQuantity?: number;
  maxQuantity?: number;
  quantitySort?: SortOrderValues;
  endDateSort?: SortOrderValues;
  startDateSort?: SortOrderValues;
};

export const productAuctionFilterFormDefaultValues: ProductAuctionFilterFormValues = {
  limit: 10,
  offset: 0,
  productName: '',
  minStartPrice: 0,
  maxStartPrice: 0,
  minBuyoutPrice: 0,
  maxBuyoutPrice: 0,
  minStartDate: undefined,
  maxStartDate: undefined,
  minEndDate: undefined,
  maxEndDate: undefined,
  minQuantity: 0,
  maxQuantity: 0,
  quantitySort: undefined,
  endDateSort: undefined,
  startDateSort: undefined,
  statuses: undefined
};

export const useProductAuctionFilterFormSchema = (): ObjectSchema<
  ProductAuctionFilterFormValues,
  AnyObject,
  {
    limit: undefined;
    offset: undefined;
    productName: undefined;
    minStartPrice: undefined;
    maxStartPrice: undefined;
    minBuyoutPrice: undefined;
    maxBuyoutPrice: undefined;
    minStartDate: undefined;
    maxStartDate: undefined;
    minEndDate: undefined;
    maxEndDate: undefined;
    minQuantity: undefined;
    maxQuantity: undefined;
    quantitySort: undefined;
    endDateSort: undefined;
    startDateSort: undefined;
  },
  ''
> => {
  return object({
    offset: number().required(),
    limit: number(),
    productName: string(),
    minQuantity: number().test('minQuantity', 'Min quantity must be less than max quantity', function (value = 0) {
      const { maxQuantity } = this.parent;
      return value > 0 ? value <= maxQuantity : true;
    }),
    maxQuantity: number().test('maxQuantity', 'Max quantity must be greater than min quantity', function (value = 0) {
      const { minQuantity } = this.parent;
      return value > 0 ? value >= minQuantity : true;
    }),
    minQuantity: number().test('minQuantity', 'Min quantity must be less than max quantity', function (value = 0) {
      const { maxQuantity } = this.parent;
      return value > 0 ? value <= maxQuantity : true;
    }),
    maxQuantity: number().test('maxQuantity', 'Max quantity must be greater than min quantity', function (value = 0) {
      const { minQuantity } = this.parent;
      return value > 0 ? value >= minQuantity : true;
    }),
    endDateSort: string().oneOf<SortOrderValues>(['ASC', 'DESC']),
    startDateSort: string().oneOf<SortOrderValues>(['ASC', 'DESC']),
    quantitySort: string().oneOf<SortOrderValues>(['ASC', 'DESC'])
  });
};
