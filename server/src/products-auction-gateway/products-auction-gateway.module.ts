import { Module } from '@nestjs/common';
import { SocketService } from 'src/socket/socket.service';
import { TokenModule } from 'src/token/token.module';
import { ProductsAuctionGateway } from './products-auction-gateway';

@Module({
  providers: [ProductsAuctionGateway, SocketService],
  imports: [TokenModule],
})
export class ProductsAuctionGatewayModule {}
