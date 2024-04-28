import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, Repository } from 'typeorm';
import { Transport } from './transport.entity';
import { CreateTransportDto } from './dto/create-transport.dto';
import { TransportErrorMessage } from './transport-error-message.enum';
import { UpdateTransportDto } from './dto/update-transport.dto';
import { DeliveryStatus } from 'src/delivery/delivery.entity';
import { DeliveryOrderStatus } from 'src/delivery-order/delivery-order.entity';

@Injectable()
export class TransportService {
    constructor(
        @InjectRepository(Transport) private readonly transportRepository: Repository<Transport>,
    ) { }

    async create(dto: CreateTransportDto, carrierId: string) {
        try {
            const transport = await this.transportRepository.save({
                ...dto,
                carrierId,
            });
            return transport;
        } catch (error) {
            throw new HttpException(
                TransportErrorMessage.FailedToCreateTransport || error.message,
                HttpStatus.BAD_REQUEST || error.message,
            );
        }
    }

    async delete(transportId: string) {
        try {
            const transport = await this.transportRepository.findOne({ where: { id: transportId } });
            if (!transport) {
                throw new HttpException(
                    TransportErrorMessage.TransportNotFound,
                    HttpStatus.NOT_FOUND,
                );
            }
            await this.transportRepository.remove(transport);
        } catch (error) {
            throw new HttpException(
                TransportErrorMessage.FailedToDeleteTransport || error.message,
                HttpStatus.BAD_REQUEST || error.message,
            );
        }
    }

    async update(transportId: string, dto: UpdateTransportDto) {
        try {
            const transport = await this.transportRepository.findOne({ where: { id: transportId } });
            if (!transport) {
                throw new HttpException(
                    TransportErrorMessage.TransportNotFound,
                    HttpStatus.NOT_FOUND,
                );
            }
            await this.transportRepository.update(transportId, dto);
        } catch (error) {
            throw new HttpException(
                TransportErrorMessage.FailedToUpdateTransport || error.message,
                HttpStatus.BAD_REQUEST || error.message,
            );
        }
    }

    async getTransportsByCarrierId(carrierId: string, isAvailable: boolean) {
        try {
            console.log('isAvailable', isAvailable)
            if (isAvailable) {
                return await this.transportRepository.createQueryBuilder('transport').leftJoinAndSelect('transport.deliveries', 'deliveries')
                    .leftJoin('deliveries.deliveryOrder', 'deliveryOrder')
                    .where('transport.carrierId = :carrierId', { carrierId }).andWhere(new Brackets(qb => {
                        qb.andWhere('deliveries.transportId IS NULL')
                            .orWhere('deliveryOrder.deliveryOrderStatus = :status', { status: DeliveryOrderStatus.Delivered })
                    })).getMany();
            }
            return await this.transportRepository.find({ where: { carrierId } });
        } catch (error) {
            throw new HttpException(
                TransportErrorMessage.FailedToGetTransports || error.message,
                HttpStatus.INTERNAL_SERVER_ERROR || error.status,
            );
        }
    }

    async getTransportsByDriverId(driverId: string) {
        try {
            return await this.transportRepository.createQueryBuilder('transport').leftJoinAndSelect('transport.deliveries', 'deliveries').leftJoinAndSelect('deliveries.driver', 'driver').where('driver.userId = :driverId', { driverId }).getMany();
        } catch (error) {
            throw new HttpException(
                TransportErrorMessage.FailedToGetTransports || error.message,
                HttpStatus.INTERNAL_SERVER_ERROR || error.status,
            );
        }
    }

    async getTransportById(transportId: string) {
        try {
            return await this.transportRepository.findOne({ where: { id: transportId } });
        } catch (error) {
            throw new HttpException(
                TransportErrorMessage.FailedToGetTransport || error.message,
                HttpStatus.INTERNAL_SERVER_ERROR || error.message,
            );
        }
    }
}
