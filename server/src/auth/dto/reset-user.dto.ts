import { PickType } from '@nestjs/mapped-types';
import { CreateUserDto } from 'src/user/dto/create-user.dto';

export class ResetUserDto extends PickType(CreateUserDto, ['email']) {}
