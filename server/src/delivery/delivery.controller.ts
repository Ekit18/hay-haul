import { Body, Controller, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
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

@UseGuards(PoliciesGuard)
@UseGuards(JwtAuthGuard)
@AllowedRoles(UserRole.Carrier)
@Controller('delivery')
export class DeliveryController {
    constructor(private deliveryService: DeliveryService) { }



    @Post()
    create(@Body() dto: CreateDeliveryDto, @Req() request: AuthenticatedRequest) {
        return this.deliveryService.create(dto, request);
    }

    @CheckPolicies([UpdateDeliveryPolicyHandler])
    @Patch(':id')
    update(@Body() dto: UpdateDeliveryDto, @Param('id') id: string) {
        return this.deliveryService.update(dto, id);
    }
}
