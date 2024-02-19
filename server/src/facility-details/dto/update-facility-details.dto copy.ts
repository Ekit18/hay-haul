import { PartialType } from '@nestjs/swagger';
import { CreateFacilityDetailsDto } from './create-facility-details.dto';

export class UpdateFacilityDetailsDto extends PartialType(
  CreateFacilityDetailsDto,
) {}
