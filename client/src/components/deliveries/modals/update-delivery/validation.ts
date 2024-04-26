import { AnyObject, ObjectSchema, object, string } from 'yup';

export type UpdateDeliveryFormValues = {
    driverId: string;

    transportId: string;

};

export const useUpdateDeliveryFormSchema = (): ObjectSchema<
    UpdateDeliveryFormValues,
    AnyObject,
    {
        driverId: undefined,
        transportId: undefined,
    },
    ''
> => {
    return object({
        driverId: string().required('Driver is required'),
        transportId: string().required('Transport is required'),
    });
};
