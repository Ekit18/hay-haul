import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Req, UseGuards } from '@nestjs/common';
import { DeliveryService } from './delivery.service';
import { AuthenticatedRequest } from 'src/lib/types/user.request.type';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CreateDeliveryDto } from './dto/create-delivery.dto';
import { CheckPolicies } from 'src/casl/casl-check-policies.decorator';
import { PoliciesGuard } from 'src/casl/policy.guard';
import { UpdateDeliveryPolicyHandler } from './casl/update-delivery.policy-handler';
import { AllowedRoles } from 'src/lib/decorators/roles-auth.decorator';
import { UserRole } from 'src/user/user.entity';
import { UpdateDeliveryDto } from './dto/update-delivery.dto';
import { FilterDeliveriesDto } from './dto/filter-deliveries.dto';
import { DriverUpdateDeliveryDto } from './dto/driver-update-delivery.dto';


@UseGuards(JwtAuthGuard)
@AllowedRoles(UserRole.Carrier, UserRole.Driver)
@Controller('delivery')
export class DeliveryController {
    constructor(private deliveryService: DeliveryService) { }

    @Get()
    getAllDeliveriesByCarrierId(@Query() dto: FilterDeliveriesDto, @Req() request: AuthenticatedRequest) {
        return this.deliveryService.findAll(dto, request)
    }

    @AllowedRoles(UserRole.Carrier, UserRole.Driver, UserRole.Farmer)
    @Get('status/:id')
    getDeliveryStatus(@Param('id') id: string) {
        return this.deliveryService.getDeliveryStatus(id);
    }

    @Get('/drivers-deliveries')
    getAllDeliveriesByDriverId(@Query() dto: FilterDeliveriesDto, @Req() request: AuthenticatedRequest) {
        return this.deliveryService.findAllDriverDeliveries(dto, request)
    }

    @Post()
    create(@Body() dto: CreateDeliveryDto, @Req() request: AuthenticatedRequest) {
        return this.deliveryService.create(dto, request);
    }

    @UseGuards(PoliciesGuard)
    @CheckPolicies([UpdateDeliveryPolicyHandler])
    @Patch('/by-carrier/:id')
    update(@Body() dto: UpdateDeliveryDto, @Param('id') id: string) {
        return this.deliveryService.update(dto, id);
    }


    @Patch('/by-driver/:id')
    @AllowedRoles(UserRole.Driver)
    updateByDriver(@Param('id') id: string, @Req() req: AuthenticatedRequest) {
        return this.deliveryService.updateStatusByDriver(id, req);
    }


    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.deliveryService.findOne(id);
    }

    @Delete(':id')
    delete(@Param('id') id: string) {
        return this.deliveryService.delete(id);
    }
}
