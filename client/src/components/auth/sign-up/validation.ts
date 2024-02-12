import { UserRole } from '@/lib/enums/user-role.enum';
import { AnyObject, ObjectSchema, array, object, string } from 'yup';

export type SignUpFormValues = {
  email: string;
  password: string;
  fullName: string;
  role: UserRole;
  farmProductTypes?: string[];
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
    farmProductTypes: '';
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
    farmProductTypes: array()
      .of(string().required())
      .required()
      .test('farmProductTypes', 'Farm product types is required', (value, context) => {
        return context.parent.role === UserRole.Farmer && value?.length > 0;
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
  farmProductTypes: [],
  facilityName: '',
  facilityAddress: '',
  facilityOfficialCode: ''
};
