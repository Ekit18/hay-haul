import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from 'src/user/user.module';
import { FacilityDetailsController } from './facility-details.controller';
import { FacilityDetails } from './facility-details.entity';
import { FacilityDetailsService } from './facility-details.service';

@Module({
  imports: [TypeOrmModule.forFeature([FacilityDetails]), UserModule],
  controllers: [FacilityDetailsController],
  providers: [FacilityDetailsService],
  exports: [FacilityDetailsService],
})
export class FacilityDetailsModule {}
