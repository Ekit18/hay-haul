import { AnyObject, ObjectSchema, number, object, string } from 'yup';
import { CreateProductFormValues } from '../create-product-modal/validation';

export type UpdateProductFormValues = Partial<Pick<CreateProductFormValues, 'name' | 'quantity'>>;

export const updateProductDefaultValues: UpdateProductFormValues = {
  name: '',
  quantity: 1
};

export const useProductUpdateFormSchema = (): ObjectSchema<
  UpdateProductFormValues,
  AnyObject,
  {
    name: undefined;
    quantity: undefined;
  },
  ''
> => {
  return object({
    name: string().min(3, 'Name must be at least 3 characters'),
    quantity: number()
      .positive('Quantity must be positive')
      .integer('Quantity must be an integer')
      .min(1, 'Quantity must be at least 1 tonne')
  });
};
