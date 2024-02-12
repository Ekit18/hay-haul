import { UserRole } from 'src/user/user.entity';

export type Tokens = {
  refreshToken: string;
  accessToken: string;
};

export type TokenData = {
  email: string;
  id: string;
  role: UserRole;
};
