import { Logger, UseGuards } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { ClientToServerEventName } from 'src/lib/enums/client-to-server-event-name.enum';
import { ClientToServerEventParameter } from 'src/lib/types/Socket/client-to-server-event-parameter.type';
import { FirstParameter } from 'src/lib/types/types';
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
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  constructor(
    private socketService: SocketService,
    private tokenService: TokenService,
  ) { }

  @WebSocketServer() public server: Server;

  private logger: Logger = new Logger('AppGateway');

  afterInit(server: Server) {
    SocketService.SocketServer = server;
    SocketService.SocketServer.use((client: AuthenticatedSocket, next) => {
      try {
        SocketAuthGuard.CanActivate(client, this.tokenService);
        next();
      } catch (e) {
        next(e);
      }
    });
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
    if (client.user.id) {
      client.join(client.user.id);
    }
  }

  @SubscribeMessage(ClientToServerEventName.JOIN_PRODUCT_AUCTION_ROOMS)
  joinProductAuctionRooms(
    @MessageBody()
    productAuctionIds: FirstParameter<
      ClientToServerEventParameter[ClientToServerEventName.JOIN_PRODUCT_AUCTION_ROOMS]
    >,
    @ConnectedSocket() client: AuthenticatedSocket,
  ) {
    this.logger.log(
      `Client ${client.user?.id} joined rooms: ${productAuctionIds}`,
    );
    client.join(productAuctionIds);
  }

  @SubscribeMessage(ClientToServerEventName.JOIN_DELIVERY_ORDER_ROOMS)
  joinDeliveryOrderRooms(
    @MessageBody()
    deliveryOrderIds: FirstParameter<
      ClientToServerEventParameter[ClientToServerEventName.JOIN_DELIVERY_ORDER_ROOMS]
    >,
    @ConnectedSocket() client: AuthenticatedSocket,
  ) {
    this.logger.log(
      `Client ${client.user?.id} joined rooms: ${deliveryOrderIds}`,
    );
    client.join(deliveryOrderIds);
  }
}
