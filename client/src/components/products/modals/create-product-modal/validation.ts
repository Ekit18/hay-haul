import { AnyObject, ObjectSchema, number, object, string } from 'yup';

export type CreateProductFormValues = {
  productTypeId: string;
  farmId: string;
  name: string;
  quantity: number;
};

export const createProductDefaultValues: CreateProductFormValues = {
  productTypeId: '',
  farmId: '',
  name: '',
  quantity: 0
};

export const useProductCreateFormSchema = (): ObjectSchema<
  CreateProductFormValues,
  AnyObject,
  {
    productTypeId: undefined;
    farmId: undefined;
    name: undefined;
    quantity: undefined;
  },
  ''
> => {
  return object({
    productTypeId: string().required('Product type is required'),
    farmId: string().required('Farm is required'),
    name: string().required('Name is required').min(3, 'Name must be at least 3 characters'),
    quantity: number()
      .required('Quantity is required')
      .positive('Quantity must be positive')
      .integer('Quantity must be an integer')
      .min(1, 'Quantity must be at least 1 tonne')
  });
};
