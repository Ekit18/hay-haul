import { AnyObject, ObjectSchema, number, object, string } from 'yup';

export type CreateDeliveryOfferValues = {
  deliveryOrderId: string;
  price: number;
};

export const useCreateDeliveryOfferFormSchema = (): ObjectSchema<
  CreateDeliveryOfferValues,
  AnyObject,
  {
    deliveryOrderId: undefined;
    price: undefined;
  },
  ''
> => {
  return object({
    deliveryOrderId: string().required('Delivery order is required'),
    price: number().required('Price is required').min(1, 'Price must be greater than 0')
  });
};
