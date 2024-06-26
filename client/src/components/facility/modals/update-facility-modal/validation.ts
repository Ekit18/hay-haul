import { AnyObject, ObjectSchema, array, object, string } from 'yup';

export type UpdateFacilityFormValues = {
  name?: string;
  address?: string;
  code?: string;
  facilityProductTypes?: string[];
};

export const updateFacilityDefaultValues: UpdateFacilityFormValues = {
  name: '',
  address: '',
  code: '',
  facilityProductTypes: []
};

export const useFacilityUpdateFormSchema = (): ObjectSchema<
  UpdateFacilityFormValues,
  AnyObject,
  {
    name: undefined;
    address: undefined;
    code: undefined;
    facilityProductTypes: '';
  },
  ''
> => {
  return object({
    name: string().min(3, 'Name must be at least 3 characters'),
    address: string().min(3, 'Address must be at least 3 characters'),
    code: string()
      .required('Must be valid EDRPOU is required')
      .matches(/^\d{8}$/, 'Must contain only numbers and be 8 characters long'),
    facilityProductTypes: array().of(string().required()).required()
  });
};
