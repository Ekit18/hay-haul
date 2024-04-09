import { UserRole } from '@/lib/enums/user-role.enum';
import { AnyObject, ObjectSchema, array, object, string } from 'yup';

export type SignUpFormValues = {
  email: string;
  password: string;
  fullName: string;
  role: UserRole;
  facilityProductTypes?: string[];
  facilityName: string;
  facilityAddress: string;
  facilityOfficialCode: string;
};

export const useSignUpFormSchema = (): ObjectSchema<
  SignUpFormValues,
  AnyObject,
  {
    email: undefined;
    password: undefined;
    fullName: undefined;
    role: undefined;
    facilityProductTypes: '';
    facilityName: undefined;
    facilityAddress: undefined;
    facilityOfficialCode: undefined;
  },
  ''
> => {
  return object({
    email: string().required('Email is required').email('Email is invalid'),
    password: string().required('Password is required').min(8, 'Password must be at least 8 characters long'),
    fullName: string().required('Full name is required'),
    role: string()
      .oneOf(Object.values(UserRole), `Role must be one of: ${Object.values(UserRole).join(',')}`)
      .required('Role is required'),
    facilityProductTypes: array()
      .of(string().required())
      .test('facilityProductTypes', 'Farm product types is required', (value, context) => {
        if (context.parent.role !== UserRole.Farmer) {
          return true;
        }
        if (!value || !value.length) {
          return false;
        }
        return true;
      }),
    facilityName: string().required('Facility name is required'),
    facilityAddress: string().required('Facility address is required'),
    facilityOfficialCode: string().required('Facility official code is required')
  });
};

export const defaultSignUpFormValues: SignUpFormValues = {
  email: '',
  password: '',
  fullName: '',
  role: UserRole.Farmer,
  facilityProductTypes: [],
  facilityName: '',
  facilityAddress: '',
  facilityOfficialCode: ''
};
