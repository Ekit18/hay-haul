import { AnyObject, ObjectSchema, object, ref, string } from 'yup';

export type DeleteFormValues = {
  originalName: string;
  confirmName: string;
};

export const deleteDefaultValues: DeleteFormValues = {
  originalName: '',
  confirmName: ''
};

export const useDeleteFormSchema = (): ObjectSchema<
  DeleteFormValues,
  AnyObject,
  {
    originalName: undefined;
    confirmName: undefined;
  },
  ''
> => {
  return object({
    originalName: string().required('Original name is required'),
    confirmName: string()
      .required('Confirmation is required')
      .oneOf([ref('originalName')], 'Confirmation must match original name')
  });
};
