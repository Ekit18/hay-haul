import { Global, Module } from '@nestjs/common';
import { TokenModule } from 'src/token/token.module';
import { SocketService } from './socket.service';

@Global()
@Module({
  providers: [SocketService],
  exports: [SocketService],
  imports: [TokenModule],
})
export class SocketModule {}
