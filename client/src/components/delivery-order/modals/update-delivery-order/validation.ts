import { addDays, isFuture } from 'date-fns';
import { AnyObject, ObjectSchema, date, number, object, string } from 'yup';

export type UpdateDeliveryOrderValues = {
  depotId: string;
  desiredDate: Date;
  desiredPrice: number;
};

export const updateDeliveryOrderDefaultValues: UpdateDeliveryOrderValues = {
  depotId: '',
  desiredDate: addDays(new Date(), 1),
  desiredPrice: 0
};

export const useUpdateDeliveryOrderFormSchema = (): ObjectSchema<
  UpdateDeliveryOrderValues,
  AnyObject,
  {
    depotId: undefined;
    desiredDate: undefined;
    desiredPrice: undefined;
  },
  ''
> => {
  return object({
    depotId: string().required('Depot is required'),
    desiredPrice: number().required('Desired price is required').min(0, 'Desired price must be greater than 0'),
    desiredDate: date()
      .required('Desired date is required')
      .min(new Date(), 'Desired date must be in the future')
      .test('is-future', 'Desired date must be in the future', (value) => isFuture(value))
  });
};
