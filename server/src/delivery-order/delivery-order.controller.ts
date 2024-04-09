import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { AllowedRoles } from 'src/lib/decorators/roles-auth.decorator';
import { AuthenticatedRequest } from 'src/lib/types/user.request.type';
import { UserRole } from 'src/user/user.entity';
import { DeliveryOrderService } from './delivery-order.service';
import { CreateDeliveryOrderDto } from './dto/create-delivery-order.dto';

@UseGuards(JwtAuthGuard)
@AllowedRoles(UserRole.Businessman, UserRole.Carrier)
@Controller('delivery-order')
export class DeliveryOrderController {
  constructor(private readonly deliveryOrderService: DeliveryOrderService) {}

  @Post('/product-auction/:auctionId/depot/:depotId')
  async createDeliveryOrder(
    @Param('auctionId') auctionId: string,
    @Param('depotId') depotId: string,
    @Body() dto: CreateDeliveryOrderDto,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.deliveryOrderService.create(dto, auctionId, req, depotId);
  }

  @Get()
  async getDeliveryOrders(@Req() req: AuthenticatedRequest) {
    return this.deliveryOrderService.findAllByUserId(req);
  }
}
