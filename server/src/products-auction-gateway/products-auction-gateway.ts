import { Logger, UseGuards } from '@nestjs/common';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { AuthenticatedSocket } from 'src/lib/types/user.request.type';
import { SocketAuthGuard } from 'src/socket/socket.guard';
import { SocketService } from 'src/socket/socket.service';
import { TokenService } from 'src/token/token.service';

@UseGuards(SocketAuthGuard)
@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class ProductsAuctionGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  constructor(
    private socketService: SocketService,
    private tokenService: TokenService,
  ) {}

  @WebSocketServer() public server: Server;

  private logger: Logger = new Logger('AppGateway');

  afterInit(server: Server) {
    if (!this.socketService.socketServer) {
      return;
    }
    this.socketService.socketServer = server;
  }

  handleDisconnect(client: AuthenticatedSocket) {
    this.logger.log(
      `Client disconnected: ${client.id} (user id: ${client.user?.id})`,
    );
  }

  handleConnection(client: AuthenticatedSocket, ...args: any[]) {
    this.logger.log(
      `Client connected: ${client.id} (user id: ${client.user?.id})`,
    );
    if (client.user.id) client.rooms.add(client.user.id);
  }
}
