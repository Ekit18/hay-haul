import { AnyObject, ObjectSchema, object, string } from 'yup';

export type CreateDeliveryFormValues = {
    driverId: string;

    transportId: string;

    deliveryOrderId: string;

};

export const createDeliveryFormDefaultValues: CreateDeliveryFormValues = {
    driverId: '',
    transportId: '',
    deliveryOrderId: '',
};

export const useCreateDeliveryFormSchema = (): ObjectSchema<
    CreateDeliveryFormValues,
    AnyObject,
    {
        driverId: undefined,
        transportId: undefined,
        deliveryOrderId: undefined,
    },
    ''
> => {
    return object({
        driverId: string().required('Driver is required'),
        transportId: string().required('Transport is required'),
        deliveryOrderId: string().required('Delivery order is required'),
    });
};
