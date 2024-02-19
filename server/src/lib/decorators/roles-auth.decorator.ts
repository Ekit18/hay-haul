import { CustomDecorator, SetMetadata } from '@nestjs/common';
import { UserRole } from 'src/user/user.entity';

export const ALLOWED_ROLES_KEY = 'roles';

export const AllowedRoles = (...roles: UserRole[]): CustomDecorator<string> =>
  SetMetadata(ALLOWED_ROLES_KEY, roles);
