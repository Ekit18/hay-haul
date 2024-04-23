import { ObjectSchema, AnyObject, object, string, number } from 'yup';
import { transportTypes } from './constants';

export type CreateTransportValues = {
    name: string;
    licensePlate: string;
    tonnage: number;
    type: string;
    carrierId: string;
}

export const useCreateTransportFormSchema = (): ObjectSchema<
    CreateTransportValues,
    AnyObject,
    {
        name: undefined;
        licensePlate: undefined;
        tonnage: undefined;
        type: undefined;
        carrierId: undefined;
    },
    ''
> => {
    return object({
        name: string().required('Name is required'),
        licensePlate: string().required('License plate is required'),
        tonnage: number().required('Tonnage is required').min(1, 'Tonnage must be greater than 0')
            .test('tonnage', 'Tonnage must correspond to type', function (value) {
                const { type } = this.parent;
                if (type === transportTypes[0].value) {
                    return value >= 0 && value <= 4536;
                }
                if (type === transportTypes[1].value) {
                    return value >= 4537 && value <= 11793;
                }
                if (type === transportTypes[2].value) {
                    return value >= 11794 && value <= 36287;
                }
                return true;
            }),
        type: string().required('Type is required'),
        carrierId: string().required('Carrier is required')
    });
}