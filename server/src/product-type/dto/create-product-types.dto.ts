import { PickType } from '@nestjs/swagger';
import { RegisterUserDto } from 'src/user/dto/register-user.dto';

export class CreateProductTypesDto extends PickType(RegisterUserDto, [
  'facilityProductTypes',
]) {}
