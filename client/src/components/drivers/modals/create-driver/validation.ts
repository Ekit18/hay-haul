import { AnyObject, ObjectSchema, number, object, string } from 'yup';

export type CreateDriverValues = {
    licenseId: string;
    yearsOfExperience: number;
    carrierId: string;
    email: string;
    password: string;
    fullName: string;
};

export const useCreateDriverFormSchema = (): ObjectSchema<
    CreateDriverValues,
    AnyObject,
    {
        licenseId: undefined;
        yearsOfExperience: undefined;
        carrierId: undefined;
        email: undefined;
        password: undefined;
        fullName: undefined;
    },
    ''> => object({
        email: string().required('Email is required').email('Email is invalid'),
        password: string().required('Password is required').min(8, 'Password must be at least 8 characters long'),
        fullName: string().required('Full name is required'),
        licenseId: string().required('License ID is required'),
        yearsOfExperience: number().required('Years of experience is required').min(1, 'Years of experience must be greater than 0'),
        carrierId: string().required('Carrier ID is required'),
    })