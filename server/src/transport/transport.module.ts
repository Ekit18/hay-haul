import { Module, OnModuleInit } from '@nestjs/common';
import { TransportController } from './transport.controller';
import { TransportService } from './transport.service';
import { TokenService } from 'src/token/token.service';
import { Transport } from './transport.entity';
import { InjectRepository, TypeOrmModule } from '@nestjs/typeorm';
import { TokenModule } from 'src/token/token.module';
import { Brackets, Repository } from 'typeorm';
import { DeliveryOrderStatus } from 'src/delivery-order/delivery-order.entity';
import { GET_AVAILABLE_TRANSPORT_FUNCTION_NAME } from 'src/function/function-data/transport.function';
import { writeFileSync } from 'fs';
import { join } from 'path';

@Module({
  controllers: [TransportController],
  providers: [TransportService],
  imports: [TokenModule, TypeOrmModule.forFeature([Transport])],
})
export class TransportModule {

}
