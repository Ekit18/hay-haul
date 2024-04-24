import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Delivery } from './delivery.entity';
import { DeliveryService } from './delivery.service';

@Module({
    imports: [TypeOrmModule.forFeature([Delivery])],
    providers: [DeliveryService],
    exports: [DeliveryService]
})
export class DeliveryModule { }
