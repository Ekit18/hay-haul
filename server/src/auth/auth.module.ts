import { Module, forwardRef } from '@nestjs/common';
import { FacilityDetailsModule } from 'src/facility-details/facility-details.module';
import { ProductTypeModule } from 'src/product-type/product-type.module';
import { TokenModule } from 'src/token/token.module';
import { UserModule } from 'src/user/user.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  providers: [AuthService],
  controllers: [AuthController],
  imports: [
    forwardRef(() => UserModule),
    TokenModule,
    FacilityDetailsModule,
    ProductTypeModule,
  ],
  exports: [AuthService],
})
export class AuthModule {}
