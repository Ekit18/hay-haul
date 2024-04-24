import { Action } from 'src/casl/actions.enum';
import { AppAbility } from 'src/casl/casl-ability.factory';
import { IPolicyHandler } from 'src/casl/casl-check-policies.decorator';
import { Delivery } from '../delivery.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ArgumentsHost } from '@nestjs/common';
import { AuthenticatedRequest } from 'src/lib/types/user.request.type';

export class UpdateDeliveryPolicyHandler implements IPolicyHandler {
    constructor(@InjectRepository(Delivery) private deliveryRepository: Repository<Delivery>) { }
    async handle(ability: AppAbility, request: AuthenticatedRequest) {
        const user = request.user;
        const delivery = await this.deliveryRepository.findOne({ where: { carrierId: user.id } })
        return ability.can(Action.Update, delivery);
    }
}