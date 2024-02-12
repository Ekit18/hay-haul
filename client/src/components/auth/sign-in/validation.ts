import { AnyObject, ObjectSchema, object, string } from 'yup';

export type SignInFormValues = {
  email: string;
  password: string;
};

export const useSignInFormSchema = (): ObjectSchema<
  SignInFormValues,
  AnyObject,
  { email: undefined; password: undefined },
  ''
> => {
  return object({
    email: string().required('Email is required').email('Email is invalid'),
    password: string().required('Password is required').min(8, 'Password must be at least 8 characters long')
  });
};
