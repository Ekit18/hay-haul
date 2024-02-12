import { Module, forwardRef } from '@nestjs/common';
import { TokenModule } from 'src/token/token.module';
import { UserModule } from 'src/user/user.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  providers: [AuthService],
  controllers: [AuthController],
  imports: [forwardRef(() => UserModule), TokenModule],
  exports: [AuthService],
})
export class AuthModule {}
