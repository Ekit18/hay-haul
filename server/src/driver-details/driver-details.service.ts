import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DriverDetails, DriverStatus } from './driver-details.entity';
import { UserService } from 'src/user/user.service';
import { CreateDriverDto } from './dto/create-driver.dto';
import { UserRole } from 'src/user/user.entity';
import { DriverDetailsErrorMessage } from './driver-details-error-message.enum';
import { UpdateDriverDto } from './dto/update-driver.dto';
import { hash } from 'bcrypt';
import { AuthErrorMessage } from 'src/auth/auth-error-message.enum';
import { RegeneratePasswordDriverDto } from './dto/regenerate-password-driver.dto';
import e from 'express';

@Injectable()
export class DriverDetailsService {
    constructor(@InjectRepository(DriverDetails) private readonly driverDetailsRepository: Repository<DriverDetails>,
        private readonly userService: UserService,
    ) { }

    async createDriver(carrierId: string, dto: CreateDriverDto) {

        const candidate = await this.userService.getUserByEmail(
            dto.email,
        );

        if (candidate) {
            throw new HttpException(
                { message: AuthErrorMessage.UserWithEmailAlreadyExists },
                HttpStatus.BAD_REQUEST,
            );
        }
        try {
            const hashPassword = await hash(dto.password, 5);

            const user = await this.userService.createDriver({ email: dto.email, fullName: dto.fullName, password: hashPassword, role: UserRole.Driver });
            const driverDetails = await this.driverDetailsRepository.save({
                ...dto,
                user,
                carrierId,
            });
            return driverDetails;
        } catch (error) {
            console.error(error)
            throw new HttpException(
                DriverDetailsErrorMessage.FailedToCreateDriver || error.message,
                HttpStatus.BAD_REQUEST
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
            await this.driverDetailsRepository.delete(driverId);
            await this.userService.remove(driverDetails.userId);
        } catch (error) {

            throw new HttpException(
                DriverDetailsErrorMessage.FailedToDeleteDriver || error.message,
                HttpStatus.BAD_REQUEST,
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

            await this.userService.update(driverDetails.userId, { email: dto.email, fullName: dto.fullName });
        } catch (error) {
            throw new HttpException(
                DriverDetailsErrorMessage.FailedToUpdateDriver || error.message,
                HttpStatus.BAD_REQUEST,
            );
        }
    }

    async getAllCarrierDrivers(carrierId: string, { isAvailable }: { isAvailable?: boolean }) {
        try {
            const queryBuilder = this.driverDetailsRepository.createQueryBuilder('driverDetails')
                .leftJoin('driverDetails.deliveries', 'deliveries')
                .addSelect('deliveries.id')
                .leftJoin('driverDetails.user', 'user')
                .addSelect([
                    'user.id',
                    'user.email',
                    'user.fullName',
                ])
                .where('driverDetails.carrierId = :carrierId', { carrierId });

            if (isAvailable) {
                queryBuilder.andWhere("deliveries.id IS NULL")
            }

            const [data, count] = await queryBuilder.getManyAndCount();
            return {
                data,
                count
            }
        } catch (error) {
            throw new HttpException(
                DriverDetailsErrorMessage.FailedToGetDrivers || error.message,
                HttpStatus.BAD_REQUEST,
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
                HttpStatus.BAD_REQUEST,
            );
        }
    }

    async regeneratePassword(driverId: string, dto: RegeneratePasswordDriverDto) {
        try {
            const driverDetails = await this.driverDetailsRepository.findOne({ where: { id: driverId } });

            if (!driverDetails) {
                throw new HttpException(
                    DriverDetailsErrorMessage.DriverNotFound,
                    HttpStatus.NOT_FOUND,
                );
            }

            const hashPassword = await hash(dto.password, 5);

            await this.userService.update(driverDetails.userId, { password: hashPassword });
        } catch (error) {
            throw new HttpException(
                DriverDetailsErrorMessage.FailedToRegeneratePassword || error.message,
                HttpStatus.BAD_REQUEST,
            );
        }
    }
}
