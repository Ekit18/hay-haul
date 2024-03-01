export enum UserRole {
  Businessman = 'Businessman',
  Carrier = 'Carrier',
  Driver = 'Driver',
  Farmer = 'Farmer'
}

export type RegisterableRoles = Exclude<UserRole, UserRole.Driver>;
