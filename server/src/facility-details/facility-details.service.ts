import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/user.entity';
import { Repository } from 'typeorm';
import { CreateFacilityDetailsDto } from './dto/create-facility-details.dto';
import { FacilityDetails } from './facility-details.entity';

@Injectable()
export class FacilityDetailsService {
  public constructor(
    @InjectRepository(FacilityDetails)
    private readonly facilityDetailsRepository: Repository<FacilityDetails>,
  ) {}

  public create(
    facilityDetailsDto: CreateFacilityDetailsDto,
    user: User,
  ): Promise<FacilityDetails> {
    return this.facilityDetailsRepository.save({
      address: facilityDetailsDto.facilityAddress,
      name: facilityDetailsDto.facilityName,
      code: facilityDetailsDto.facilityOfficialCode,
      user,
    });
  }
}
