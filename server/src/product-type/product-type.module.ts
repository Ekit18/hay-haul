import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FacilityDetailsModule } from 'src/facility-details/facility-details.module';
import { TokenModule } from 'src/token/token.module';
import { ProductTypeController } from './product-type.controller';
import { ProductType } from './product-type.entity';
import { ProductTypeService } from './product-type.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([ProductType]),
    forwardRef(() => FacilityDetailsModule),
    TokenModule,
  ],
  controllers: [ProductTypeController],
  providers: [ProductTypeService],
  exports: [ProductTypeService],
})
export class ProductTypeModule {}
