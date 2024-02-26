import { UserRole } from 'src/user/user.entity';

export type TokenPayload = {
  email: string;
  id: string;
  isVerified: boolean;
  name: string;
  role: UserRole;
};
