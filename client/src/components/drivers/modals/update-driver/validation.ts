import { ObjectSchema, AnyObject, object, string, number } from 'yup';

export type UpdateDriverValues = {
    licenseId: string;
    yearsOfExperience: number;
    email: string;
    fullName: string;
};


export const useUpdateDriverFormSchema = (): ObjectSchema<
    UpdateDriverValues,
    AnyObject,
    {
        licenseId: undefined;
        yearsOfExperience: undefined;
        email: undefined;
        fullName: undefined;
    },
    ''> => object({
        fullName: string().required('Full name is required'),
        licenseId: string().required('License ID is required'),
        yearsOfExperience: number().required('Years of experience is required').min(1, 'Years of experience must be greater than 0'),
        email: string().required('Email is required').email('Email is invalid'),
    })