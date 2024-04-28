import { DriverStatus } from '@/lib/types/Driver/Driver.type';

export type DriverCardStatusType = {
    [K in keyof typeof DriverStatus]: string;
};

export const driverCardStatus: DriverCardStatusType = {
    [DriverStatus.Idle]: 'bg-gray-400 text-white',
    [DriverStatus.Busy]: 'bg-green-500 text-white',
};