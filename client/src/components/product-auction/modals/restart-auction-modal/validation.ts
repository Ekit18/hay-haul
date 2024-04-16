import { ComparisonOperator } from '@/lib/enums/comparison-operator.enum';
import { compareValues } from '@/lib/helpers/compareValues';
import { RequiredDateRange } from '@/lib/types/types';
import { addDays } from 'date-fns';
import { AnyObject, ObjectSchema, date, object } from 'yup';
import { dateRangeRequiredObjectSchema } from '../../product-auction-filter/validation';

export type RestartProductAuctionFormValues = {
  startEndDate: RequiredDateRange;
  paymentPeriod: Date;
};

export const restartProductAuctionDefaultValues: RestartProductAuctionFormValues = {
  startEndDate: {
    from: new Date(),
    to: addDays(new Date(), 1)
  },
  paymentPeriod: addDays(new Date(), 2)
};

export const useProductAuctionRestartFormSchema = (): ObjectSchema<
  RestartProductAuctionFormValues,
  AnyObject,
  {
    startEndDate: {
      from: undefined;
      to: undefined;
    };
    paymentPeriod: undefined;
  },
  ''
> => {
  return object({
    startEndDate: object(dateRangeRequiredObjectSchema)
      .required('Start / end date is required')
      .test('startEndDate', 'Min start date must be less than max start date', function (value) {
        const dateRange = value as RequiredDateRange;
        return compareValues(dateRange.from, dateRange.to, ComparisonOperator.LESS_THAN);
      }),
    paymentPeriod: date()
      .required('Payment period is required')
      .test('startEndDate', 'Payment period must be greater than end date', function (value, context) {
        const { startEndDate } = context.parent as RestartProductAuctionFormValues;
        return compareValues(startEndDate.to, value, ComparisonOperator.LESS_THAN);
      })
  });
};
