import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthErrorMessage } from 'src/auth/auth-error-message.enum';
import { UserService } from 'src/user/user.service';
import { Repository } from 'typeorm';
import { CreateFacilityDetailsDto } from './dto/create-facility-details.dto';
import { UpdateFacilityDetailsDto } from './dto/update-facility-details.dto copy';
import { FacilityDetails } from './facility-details.entity';

@Injectable()
export class FacilityDetailsService {
  public constructor(
    @InjectRepository(FacilityDetails)
    private readonly facilityDetailsRepository: Repository<FacilityDetails>,
    private readonly userService: UserService,
  ) {}

  public async create(
    facilityDetailsDto: CreateFacilityDetailsDto,
    userId: string,
  ): Promise<FacilityDetails> {
    try {
      const user = await this.userService.getUserById(userId);

      if (!user) {
        throw new HttpException(
          { message: AuthErrorMessage.UserNotFound },
          HttpStatus.BAD_REQUEST,
        );
      }

      return this.facilityDetailsRepository.save({
        address: facilityDetailsDto.address,
        name: facilityDetailsDto.name,
        code: facilityDetailsDto.code,
        user,
      });
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  public async getAll(): Promise<FacilityDetails[]> {
    try {
      return this.facilityDetailsRepository.find();
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  public getAllByUserId(userId: string): Promise<FacilityDetails[]> {
    try {
      return (
        this.facilityDetailsRepository
          .createQueryBuilder('facilityDetails')
          .select()
          // .leftJoinAndSelect('facilityDetails.user', 'user')
          .where('facilityDetails.user.id = :userId', { userId })
          .leftJoinAndSelect('facilityDetails.productTypes', 'productTypes')
          .getMany()
      );
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  public async getOneById(id: string): Promise<FacilityDetails> {
    try {
      return this.facilityDetailsRepository.findOne({
        where: { id },
        relations: { productTypes: true },
      });
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  public async remove(id: string): Promise<void> {
    try {
      await this.facilityDetailsRepository.delete(id);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  public async update(
    id: string,
    facilityDetailsDto: UpdateFacilityDetailsDto,
  ): Promise<FacilityDetails> {
    try {
      const result = await this.facilityDetailsRepository.update(
        id,
        facilityDetailsDto,
      );
      return this.facilityDetailsRepository.findOneById(id);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
}
