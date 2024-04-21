import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DriverDetails, DriverStatus } from './driver-details.entity';
import { UserService } from 'src/user/user.service';
import { CreateDriverDto } from './dto/create-driver.dto';
import { UserRole } from 'src/user/user.entity';
import { DriverDetailsErrorMessage } from './driver-details-error-message.enum';
import { UpdateDriverDto } from './dto/update-driver.dto';

@Injectable()
export class DriverDetailsService {
    constructor(@InjectRepository(DriverDetails) private readonly driverDetailsRepository: Repository<DriverDetails>,
        private readonly userService: UserService,
    ) { }

    async createDrive(carrierId: string, dto: CreateDriverDto) {
        try {
            const user = await this.userService.createDriver({ email: dto.email, fullName: dto.fullName, password: dto.password, role: UserRole.Driver });
            const driverDetails = await this.driverDetailsRepository.save({
                ...dto,
                user,
                carrierId,
            });
            return driverDetails;
        } catch (error) {
            throw new HttpException(
                DriverDetailsErrorMessage.FailedToCreateDriver || error.message,
                HttpStatus.BAD_REQUEST || error.message,
            );
        }
    }

    async delete(driverId: string) {
        try {
            const driverDetails = await this.driverDetailsRepository.findOne({ where: { id: driverId } });
            if (!driverDetails) {
                throw new HttpException(
                    DriverDetailsErrorMessage.DriverNotFound,
                    HttpStatus.NOT_FOUND,
                );
            }
            await this.userService.remove(driverDetails.userId);
        } catch (error) {
            throw new HttpException(
                DriverDetailsErrorMessage.FailedToDeleteDriver || error.message,
                HttpStatus.BAD_REQUEST || error.message,
            );
        }
    }

    async update(driverId: string, dto: UpdateDriverDto) {
        try {
            const driverDetails = await this.driverDetailsRepository.findOne({ where: { id: driverId } });
            if (!driverDetails) {
                throw new HttpException(
                    DriverDetailsErrorMessage.DriverNotFound,
                    HttpStatus.NOT_FOUND,
                );
            }
            const status = DriverStatus[dto.driverStatus as keyof typeof DriverStatus];
            await this.driverDetailsRepository.update(driverId, {
                licenseId: dto.licenseId,
                yearsOfExperience: dto.yearsOfExperience,
                status,
            });
            await this.userService.update(driverDetails.userId, { email: dto.email, password: dto.password, userName: dto.userName });
        } catch (error) {
            throw new HttpException(
                DriverDetailsErrorMessage.FailedToUpdateDriver || error.message,
                HttpStatus.BAD_REQUEST || error.message,
            );
        }
    }

    async getAllCarrierDrivers(carrierId: string) {
        try {
            return await this.driverDetailsRepository.createQueryBuilder('driverDetails').leftJoin('driverDetails.user', 'user').addSelect([
                'user.id',
                'user.email',
                'user.fullName',
            ]).where('driverDetails.carrierId = :carrierId', { carrierId }).getMany();
        } catch (error) {
            throw new HttpException(
                DriverDetailsErrorMessage.FailedToGetDrivers || error.message,
                HttpStatus.BAD_REQUEST || error.message,
            );
        }
    }

    async getDriverById(driverId: string) {
        try {
            return await this.driverDetailsRepository.createQueryBuilder('driverDetails').leftJoin('driverDetails.user', 'user').addSelect([
                'user.id',
                'user.email',
                'user.fullName',
            ]).where('driverDetails.id = :driverId', { driverId }).getOne();
        } catch (error) {
            throw new HttpException(
                DriverDetailsErrorMessage.FailedToGetDriver || error.message,
                HttpStatus.BAD_REQUEST || error.message,
            );
        }
    }

}
