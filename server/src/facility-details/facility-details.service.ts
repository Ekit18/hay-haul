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
      address: facilityDetailsDto.address,
      name: facilityDetailsDto.name,
      code: facilityDetailsDto.code,
      user,
    });
  }

  public async findAll(): Promise<FacilityDetails[]> {
    return this.facilityDetailsRepository.find();
  }

  public findOne(id: number): Promise<FacilityDetails> {
    return this.facilityDetailsRepository.findOneById(id);
  }

  public async remove(id: number): Promise<void> {
    await this.facilityDetailsRepository.delete(id);
  }

  public async update(
    id: number,
    facilityDetailsDto: CreateFacilityDetailsDto,
  ): Promise<FacilityDetails> {
    const result = await this.facilityDetailsRepository.update(
      id,
      facilityDetailsDto,
    );
    return this.facilityDetailsRepository.findOneById(id);
  }
}
