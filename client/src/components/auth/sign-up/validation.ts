import { UserRole } from '@/lib/enums/user-role.enum';
import { AnyObject, ObjectSchema, object, string } from 'yup';

export type SignInFormValues = {
  email: string;
  password: string;
  fullName: string;
  role: UserRole;
  farmProductTypes?: string[];
  facilityName: string;
  facilityAddress: string;
  facilityOfficialCode: string;
};

export const useSignInFormSchema = (): ObjectSchema<
  SignInFormValues,
  AnyObject,
  {
    email: undefined;
    password: undefined;
    fullName: undefined;
    role: undefined;
    farmProductTypes: undefined;
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
    farmProductTypes: string().test('farmProductTypes', 'Farm product types is required', (value, context) => {
      return context.parent.role === UserRole.FARMER && value?.length > 0;
    })
  });
};
