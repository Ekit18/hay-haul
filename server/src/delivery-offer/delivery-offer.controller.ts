import { Body, Controller, Delete, Param, Post, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { AllowedRoles } from 'src/lib/decorators/roles-auth.decorator';
import { AuthenticatedRequest } from 'src/lib/types/user.request.type';
import { UserRole } from 'src/user/user.entity';
import { DeliveryOfferService } from './delivery-offer.service';
import { CreateDeliveryOfferDto } from './dto/create-delivery-offer.dto';

@UseGuards(JwtAuthGuard)
@AllowedRoles(UserRole.Carrier)
@Controller('delivery-offer')
export class DeliveryOfferController {
  constructor(private readonly deliveryOfferService: DeliveryOfferService) { }

  @AllowedRoles(UserRole.Businessman)
  @Post('accept/:id')
  async acceptOfferById(@Req() request: AuthenticatedRequest, @Param('id') id: string) {
    return this.deliveryOfferService.acceptOfferById(request, id)
  }

  @Post('/delivery-order/:deliveryOrderId')
  async createDeliveryOffer(
    @Param('deliveryOrderId') deliveryOrderId: string,
    @Req() req: AuthenticatedRequest,
    @Body() dto: CreateDeliveryOfferDto,
  ) {
    return await this.deliveryOfferService.createDeliveryOffer(
      deliveryOrderId,
      req,
      dto,
    );
  }

  @AllowedRoles(UserRole.Businessman)
  @Post('decline/:id')
  async decline(@Param('id') id: string) {
    return this.deliveryOfferService.rejectOfferById(id)
  }

  @Delete('/:deliveryOfferId')
  async deleteDeliveryOffer(@Param('deliveryOfferId') deliveryOfferId: string, @Req() req: AuthenticatedRequest) {
    return await this.deliveryOfferService.deleteDeliveryOffer(deliveryOfferId, req);
  }
}
