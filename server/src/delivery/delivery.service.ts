import { Injectable } from '@nestjs/common';
import { Delivery } from './delivery.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateDeliveryDto } from './dto/create-delivery.dto';
import { TransportService } from 'src/transport/transport.service';
import { DriverDetailsService } from 'src/driver-details/driver-details.service';
import { AuthenticatedRequest } from 'src/lib/types/user.request.type';
import { UpdateDeliveryDto } from './dto/update-delivery.dto';

@Injectable()
export class DeliveryService {
    constructor(
        @InjectRepository(Delivery) private deliveryRepository: Repository<Delivery>,
    ) { }

    async create(dto: CreateDeliveryDto, { user: { id: carrierId } }: AuthenticatedRequest) {
        return this.deliveryRepository.save({ ...dto, carrierId });
    }

    async update(dto: UpdateDeliveryDto, id: string) {
        return this.deliveryRepository.save({ ...dto, id })
    }

    async delete(id: string) {
        return this.deliveryRepository.delete(id);
    }

    async findOne(id: string) {
        return this.deliveryRepository.findOne({ where: { id } });
    }

    async findAll() {
        return this.deliveryRepository.find();
    }
}
