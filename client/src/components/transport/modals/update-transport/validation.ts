import { ObjectSchema, AnyObject, object, string } from 'yup';

export type UpdateTransportValues = {
    name: string;
    licensePlate: string;
    type: string;
}

export const useUpdateTransportFormSchema = (): ObjectSchema<
    UpdateTransportValues,
    AnyObject,
    {
        name: undefined;
        licensePlate: undefined;
        type: undefined;
    },
    ''
> => {
    return object({
        name: string().required('Name is required'),
        licensePlate: string().required('License plate is required'),
        type: string().required('Type is required'),
    });
}