import { PickType } from '@nestjs/swagger';
import { RegisterUserDto } from 'src/user/dto/register-user.dto';

export class CreateFacilityDetailsDto extends PickType(RegisterUserDto, [
  'facilityName',
  'facilityAddress',
  'facilityOfficialCode',
]) {}
