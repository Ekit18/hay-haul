import { Module, forwardRef } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TokenModule } from 'src/token/token.module';
import { UserModule } from 'src/user/user.module';
import { AuthService } from './auth.service';

@Module({
  providers: [AuthService],
  imports: [forwardRef(() => UserModule), TokenModule],
  exports: [AuthService, JwtModule],
})
export class AuthModule {}
