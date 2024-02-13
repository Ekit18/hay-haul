export enum UserRole {
  Businessman = 'Businessman',
  Carrier = 'Carrier',
  Driver = 'Driver',
  Farmer = 'Farmer'
}

export type RegisterableRoles = UserRole.Farmer | UserRole.Carrier | UserRole.Businessman;
