import { UserRole } from '@/lib/enums/user-role.enum';

export type User = {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
  isVerified: boolean;
  payoutsEnabled?: boolean;
  stripeAccountId?: string;
};

export type UserToken = User & {
  iat: number;
  exp: number;
};
