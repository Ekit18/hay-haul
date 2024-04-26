import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { AllowedRoles } from 'src/lib/decorators/roles-auth.decorator';
import { AuthenticatedRequest } from 'src/lib/types/user.request.type';
import { UserRole } from 'src/user/user.entity';
import { DeliveryOrderService } from './delivery-order.service';
import { CreateDeliveryOrderDto } from './dto/create-delivery-order.dto';
import { UpdateDeliveryOrderDto } from './dto/update-delivery-order.dto';
import { DeliveryOrderQueryDto } from './dto/delivery-order-query.dto';
import { DeliveryOrderLocationsQueryDto } from './dto/delivery-order-locations-query.dto';
import { DeliveryOrderLocationsQueryResponse } from './dto/delivery-order-locations-query-response.dto';

@UseGuards(JwtAuthGuard)
@AllowedRoles(UserRole.Businessman, UserRole.Carrier)
@Controller('delivery-order')
export class DeliveryOrderController {
  constructor(private readonly deliveryOrderService: DeliveryOrderService) { }

  @Post('/product-auction/:auctionId/depot/:depotId')
  async createDeliveryOrder(
    @Param('auctionId') auctionId: string,
    @Param('depotId') depotId: string,
    @Body() dto: CreateDeliveryOrderDto,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.deliveryOrderService.create(dto, auctionId, req, depotId);
  }

  @Get('/locations')
  async getAllFarmAndDepotLocations(@Query() query: DeliveryOrderLocationsQueryDto): Promise<DeliveryOrderLocationsQueryResponse> {
    return this.deliveryOrderService.findAllLocations(query);
  }

  @Get('/carrier-offers')
  async getCarrierOffers(@Req() req: AuthenticatedRequest, @Query() query: DeliveryOrderQueryDto) {
    return this.deliveryOrderService.findCarrierOffers(req, query);
  }

  @Get()
  async getDeliveryOrders(
    @Req() req: AuthenticatedRequest,
    @Query() query: DeliveryOrderQueryDto,
  ) {
    return this.deliveryOrderService.findAllByUserId(req, query);
  }

  @Get('/orders-for-delivery')
  async getAllOrdersForDelivery(@Query() query: DeliveryOrderQueryDto) {
    return this.deliveryOrderService.findAllOrdersForDelivery(query);
  }

  @Get('/all-orders')
  async getAllDeliveryOrders(@Query() query: DeliveryOrderQueryDto) {
    return this.deliveryOrderService.findAllDeliveryOrders(query);
  }

  @Get('order/:id')
  async getDeliveryOrder(@Param('id') id: string) {
    return this.deliveryOrderService.findOneById(id);
  }

  @Post('/:id')
  async startDeliveryOrder(
    @Param('id') id: string,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.deliveryOrderService.startDeliveryOrder(id, req);
  }

  @Patch('/:id')
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateDeliveryOrderDto,
    @Req() request: AuthenticatedRequest,
  ) {
    return this.deliveryOrderService.update(id, dto, request);
  }

  @Delete('/:id')
  async deleteDeliveryOrder(
    @Param('id') id: string,
    @Req() request: AuthenticatedRequest,
  ) {
    return this.deliveryOrderService.deleteById(id, request);
  }
}
