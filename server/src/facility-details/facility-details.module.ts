import { Module } from '@nestjs/common';
import { CompanyDetailsController } from './company-details.controller';
import { CompanyDetailsService } from './company-details.service';

@Module({
  imports: [TypeOrmModulep.for],
  controllers: [CompanyDetailsController],
  providers: [CompanyDetailsService],
})
export class CompanyDetailsModule {}
