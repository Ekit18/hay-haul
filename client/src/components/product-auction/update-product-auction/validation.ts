import { FileObject } from '@/components/drag-and-drop/file-object.type';
import { ComparisonOperator } from '@/lib/enums/comparison-operator.enum';
import { compareValues } from '@/lib/helpers/compareValues';
import { RequiredDateRange } from '@/lib/types/types';
import { AnyObject, ObjectSchema, date, mixed, number, object, string } from 'yup';
import { dateRangeRequiredObjectSchema } from '../product-auction-filter/validation';

export type UpdateProductAuctionFormValues = {
  startPrice: number;
  buyoutPrice: number;
  startEndDate: RequiredDateRange;
  paymentPeriod: Date;
  bidStep: number;
  description: string;
  productName: string;
  farmName: string;
  photos: FileObject[];
};

export const useProductAuctionUpdateFormSchema = (): ObjectSchema<
  UpdateProductAuctionFormValues,
  AnyObject,
  {
    startPrice: undefined;
    buyoutPrice: undefined;
    startEndDate: {
      from: undefined;
      to: undefined;
    };
    paymentPeriod: undefined;
    bidStep: undefined;
    description: undefined;
    productName: undefined;
    farmName: undefined;
  },
  ''
> => {
  return object({
    startPrice: number().required('Start price is required').min(0, 'Start price must be greater than 0'),
    buyoutPrice: number()
      .required('Buyout price is required')
      .min(0, 'Buyout price must be greater than 0')
      .test('buyoutPrice', 'Buyout price must be greater than start price', function (value, context) {
        const { startPrice } = context.parent as UpdateProductAuctionFormValues;
        return compareValues(startPrice, value, ComparisonOperator.LESS_THAN);
      }),
    startEndDate: object(dateRangeRequiredObjectSchema)
      .required('Start / end date is required')
      .test('startEndDate', 'Min start date must be less than max start date', function (value) {
        const dateRange = value as RequiredDateRange;
        return compareValues(dateRange.from, dateRange.to, ComparisonOperator.LESS_THAN);
      }),
    paymentPeriod: date()
      .required('Payment period is required')
      .test('startEndDate', 'Payment period must be greater than end date', function (value, context) {
        const { startEndDate } = context.parent as UpdateProductAuctionFormValues;
        return compareValues(startEndDate.to, value, ComparisonOperator.LESS_THAN);
      }),
    bidStep: number().required('Bid step is required').min(1, 'Bid step must be greater than 0'),
    description: string().required('Description is required').min(10, 'Description must be at least 10 characters'),
    productName: string().required('Product is required'),
    farmName: string().required('Farm is required'),
    photos: mixed<FileObject[]>().required('Photos are required')
  });
};
