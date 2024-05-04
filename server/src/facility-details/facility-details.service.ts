import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  forwardRef,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthErrorMessage } from 'src/auth/auth-error-message.enum';
import { ProductTypeService } from 'src/product-type/product-type.service';
import { ProductService } from 'src/product/product.service';
import { UserService } from 'src/user/user.service';
import { QueryFailedError, Repository } from 'typeorm';
import { CreateFacilityDetailsDto } from './dto/create-facility-details.dto';
import { UpdateFacilityDetailsDto } from './dto/update-facility-details.dto';
import { FacilityDetailsErrorMessage } from './facility-details-error-message.enum';
import { FacilityDetails } from './facility-details.entity';
import { DELETE_FACILITY_DETAILS_PROCEDURE_NAME } from 'src/procedures/procedures-data/facility-details.procedure';

@Injectable()
export class FacilityDetailsService {
  public constructor(
    @InjectRepository(FacilityDetails)
    private readonly facilityDetailsRepository: Repository<FacilityDetails>,
    private readonly userService: UserService,
    @Inject(forwardRef(() => ProductTypeService))
    private readonly productTypeService: ProductTypeService,
    @Inject(forwardRef(() => ProductService))
    private readonly productService: ProductService,
  ) { }

  public async findByCode(code: string) {
    return await this.facilityDetailsRepository.findOne({ where: { code } })
  }

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

      const facilityDetails = await this.facilityDetailsRepository.save({
        address: facilityDetailsDto.address,
        name: facilityDetailsDto.name,
        code: facilityDetailsDto.code,
        user,
      });

      if (facilityDetailsDto.facilityProductTypes) {
        await this.productTypeService.createMany(
          facilityDetailsDto.facilityProductTypes,
          facilityDetails,
        );
      }

      return facilityDetails;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  public getAllByUserId(userId: string): Promise<FacilityDetails[]> {
    try {
      return this.facilityDetailsRepository
        .createQueryBuilder('facilityDetails')
        .select()
        .where('facilityDetails.user.id = :userId', { userId })
        .leftJoinAndSelect('facilityDetails.productTypes', 'productTypes')
        .getMany();
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
      await this.facilityDetailsRepository.query(`execute ${DELETE_FACILITY_DETAILS_PROCEDURE_NAME} @id=@0`, [id])
    } catch (error) {
      console.log(error);
      if (error instanceof QueryFailedError) {
        const errorObject = error.driverError.originalError.info;

        const triggerErrorMessage = errorObject.message;

        const isTriggerErrorMessage =
          errorObject.procName === `${DELETE_FACILITY_DETAILS_PROCEDURE_NAME}`;

        throw new HttpException(
          isTriggerErrorMessage
            ? triggerErrorMessage
            : FacilityDetailsErrorMessage.FailedToDeleteFacilityDetails,
          HttpStatus.BAD_REQUEST,
        );
      }

      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  public async update(
    id: string,
    { facilityProductTypes, ...facilityDetailsDto }: UpdateFacilityDetailsDto,
  ): Promise<FacilityDetails> {
    try {
      await this.facilityDetailsRepository.update(id, facilityDetailsDto);

      return this.facilityDetailsRepository.findOne({ where: { id } });
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
}
