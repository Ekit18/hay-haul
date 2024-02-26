import { UserRole } from '@/lib/enums/user-role.enum';

export type User = {
  id: string;
  email: string;
  name: string;
  role: UserRole;
};
