import { Controller, Post } from '@nestjs/common';
import { FacilityDetailsService } from './facility-details.service';

@Controller('facility-details')
export class FacilityDetailsController {
  public constructor(
    private readonly facilityDetailsService: FacilityDetailsService,
  ) {}

  @Post()
  public async createFacilityDetails() {
    return await this.facilityDetailsService.createFacilityDetails();
  }
}
