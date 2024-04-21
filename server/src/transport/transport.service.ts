import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Transport } from './transport.entity';
import { CreateTransportDto } from './dto/create-transport.dto';
import { TransportErrorMessage } from './transport-error-message.enum';

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

    async update(transportId: string, dto: CreateTransportDto) {
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

    async getTransportsByCarrierId(carrierId: string) {
        try {
            return await this.transportRepository.find({ where: { carrierId } });
        } catch (error) {
            throw new HttpException(
                TransportErrorMessage.FailedToGetTransports || error.message,
                HttpStatus.INTERNAL_SERVER_ERROR || error.message,
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
