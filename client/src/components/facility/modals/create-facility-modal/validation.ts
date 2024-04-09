import { AnyObject, ObjectSchema, array, object, string } from 'yup';

export type CreateFacilityFormValues = {
  name: string;
  address: string;
  code: string;
  facilityProductTypes?: string[];
};

export const createFacilityDefaultValues: CreateFacilityFormValues = {
  name: '',
  address: '',
  code: '',
  facilityProductTypes: []
};

export const useFacilityCreateFormSchema = (): ObjectSchema<
  CreateFacilityFormValues,
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
    name: string().required('Name is required').min(3, 'Name must be at least 3 characters'),
    address: string().required('Address is required').min(3, 'Address must be at least 3 characters'),
    code: string()
      .required('Must be valid EDRPOU is required')
      .matches(/^\d{8}$/, 'Must contain only numbers and be 8 characters long'),
    facilityProductTypes: array().of(string().required()).required()
  });
};
