import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FacilityDetailsController } from './facility-details.controller';
import { FacilityDetails } from './facility-details.entity';
import { FacilityDetailsService } from './facility-details.service';
import { FacilityDetailsController } from './facility-details.controller';

@Module({
  imports: [TypeOrmModule.forFeature([FacilityDetails])],
  controllers: [FacilityDetailsController],
  providers: [FacilityDetailsService],
  exports: [FacilityDetailsService],
})
export class FacilityDetailsModule {}
