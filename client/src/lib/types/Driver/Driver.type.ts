import { User } from '../User/User.type';
import { ValueOf } from '../types';

export const DriverStatus = {
    Idle: 'Idle',
    Inactive: 'Inactive',
} as const;

export type DriverStatusValues = ValueOf<typeof DriverStatus>;

export type Driver = {
    id: string;
    licenseId: string;
    yearsOfExperience: number;
    carrierId: string;
    carrier: User;
    userId: string;
    user: Pick<User, 'fullName' | 'email' | 'id'>;
    status: DriverStatusValues;

}

