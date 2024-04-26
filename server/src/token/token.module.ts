import { Global, Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Token } from './token.entity';
import { TokenService } from './token.service';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([Token])],
  providers: [TokenService, JwtService],
  exports: [TokenService, JwtService],
})
export class TokenModule { }
