import { UserRole } from 'src/user/user.entity';

export type TokenPayload = {
  email: string;
  id: string;
  isVerified: boolean;
  fullName: string;
  role: UserRole;
  payoutsEnabled?: boolean;
  stripeAccountId?: string;
};
