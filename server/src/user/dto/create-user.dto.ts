import { PickType } from '@nestjs/swagger';
import { RegisterUserDto } from './register-user.dto';

export class CreateUserDto extends PickType(RegisterUserDto, [
  'email',
  'password',
  'fullName',
  'role',
]) {}
