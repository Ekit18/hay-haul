import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductTypeModule } from 'src/product-type/product-type.module';
import { TokenModule } from 'src/token/token.module';
import { UserModule } from 'src/user/user.module';
import { FacilityDetailsController } from './facility-details.controller';
import { FacilityDetails } from './facility-details.entity';
import { FacilityDetailsService } from './facility-details.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([FacilityDetails]),
    UserModule,
    forwardRef(() => ProductTypeModule),
    TokenModule,
  ],
  controllers: [FacilityDetailsController],
  providers: [FacilityDetailsService],
  exports: [FacilityDetailsService],
})
export class FacilityDetailsModule {}
