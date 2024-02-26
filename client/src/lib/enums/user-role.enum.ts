import { ValueOf } from '../types/types';

export enum UserRole {
  Businessman = 'Businessman',
  Carrier = 'Carrier',
  Driver = 'Driver',
  Farmer = 'Farmer'
}

export type RegisterableRoles = Exclude<ValueOf<UserRole>, UserRole.Driver>;
