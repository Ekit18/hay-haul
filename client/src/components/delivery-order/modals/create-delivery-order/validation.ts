import { addDays, isFuture } from 'date-fns';
import { AnyObject, ObjectSchema, date, number, object, string } from 'yup';

export type CreateDeliveryOrderValues = {
  depotId: string;
  desiredDate: Date;
  desiredPrice: number;
  auctionId: string;
};

export const createDeliveryOrderDefaultValues: CreateDeliveryOrderValues = {
  depotId: '',
  desiredDate: addDays(new Date(), 1),
  desiredPrice: 0,
  auctionId: ''
};

export const useCreateDeliveryOrderFormSchema = (): ObjectSchema<
  CreateDeliveryOrderValues,
  AnyObject,
  {
    depotId: undefined;
    desiredDate: undefined;
    desiredPrice: undefined;
    auctionId: undefined;
  },
  ''
> => {
  return object({
    depotId: string().required('Depot is required'),
    desiredPrice: number().required('Desired price is required').min(0, 'Desired price must be greater than 0'),
    desiredDate: date()
      .required('Desired date is required')
      .min(new Date(), 'Desired date must be in the future')
      .test('is-future', 'Desired date must be in the future', (value) => isFuture(value)),
    auctionId: string().required('Product auction is required')
  });
};
