import { Injectable, Scope } from '@nestjs/common';
import { Server } from 'socket.io';

@Injectable({ scope: Scope.DEFAULT })
export class SocketService {
  public socketServer: Server;
}
