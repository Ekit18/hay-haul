import { ObjectSchema, AnyObject, object, string, number } from 'yup';
import { transportTypes } from './constants';

export type CreateTransportValues = {
    name: string;
    licensePlate: string;
    type: string;
    carrierId: string;
}

export const useCreateTransportFormSchema = (): ObjectSchema<
    CreateTransportValues,
    AnyObject,
    {
        name: undefined;
        licensePlate: undefined;
        type: undefined;
        carrierId: undefined;
    },
    ''
> => {
    return object({
        name: string().required('Name is required'),
        licensePlate: string().required('License plate is required'),
        type: string().required('Type is required'),
        carrierId: string().required('Carrier is required')
    });
}