import { Module } from '@nestjs/common';
import { DriverDetailsController } from './driver-details.controller';
import { DriverDetailsService } from './driver-details.service';
import { DriverDetails } from './driver-details.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TokenModule } from 'src/token/token.module';
import { UserModule } from 'src/user/user.module';

@Module({
  controllers: [DriverDetailsController],
  providers: [DriverDetailsService],
  imports: [TypeOrmModule.forFeature([DriverDetails]), TokenModule, UserModule],
})
export class DriverDetailsModule { }
