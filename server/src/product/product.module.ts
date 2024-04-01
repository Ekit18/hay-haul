import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FacilityDetailsModule } from 'src/facility-details/facility-details.module';
import { ProductTypeModule } from 'src/product-type/product-type.module';
import { TokenModule } from 'src/token/token.module';
import { ProductController } from './product.controller';
import { Product } from './product.entity';
import { ProductService } from './product.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Product]),
    forwardRef(() => FacilityDetailsModule),
    forwardRef(() => ProductTypeModule),
    TokenModule,
  ],
  controllers: [ProductController],
  providers: [ProductService],
  exports: [ProductService],
})
export class ProductModule {}
