import { Module } from '@nestjs/common';
import { TransportController } from './transport.controller';
import { TransportService } from './transport.service';
import { TokenService } from 'src/token/token.service';
import { Transport } from './transport.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TokenModule } from 'src/token/token.module';

@Module({
  controllers: [TransportController],
  providers: [TransportService],
  imports: [TokenModule, TypeOrmModule.forFeature([Transport])],
})
export class TransportModule { }
