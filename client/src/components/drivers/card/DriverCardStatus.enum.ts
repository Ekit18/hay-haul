import { DriverStatus } from '@/lib/types/Driver/Driver.type';

export type DriverCardStatusType = {
    [K in keyof typeof DriverStatus]: string;
};

export const driverCardStatus: DriverCardStatusType = {
    [DriverStatus.Active]: 'bg-green-500 text-white',
    [DriverStatus.Inactive]: 'bg-gray-400 text-white'
};