import { Injectable, CanActivate, ExecutionContext, ArgumentsHost, Type } from '@nestjs/common';
import { ModuleRef, Reflector } from '@nestjs/core';
import { CaslAbilityFactory, AppAbility } from './casl-ability.factory';
import { CheckPolicies, IPolicyHandler } from './casl-check-policies.decorator';

@Injectable()
export class PoliciesGuard implements CanActivate {
    constructor(
        private reflector: Reflector,
        private caslAbilityFactory: CaslAbilityFactory,
        private moduleRef: ModuleRef
    ) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const policyHandlerRefs =
            this.reflector.get<Type<IPolicyHandler>[]>(
                CheckPolicies,
                context.getHandler(),
            ) || [];

        const policyHandlers = await Promise.all(policyHandlerRefs.map(async (ref) => await this.moduleRef.create<IPolicyHandler>(ref)))

        const request = context.switchToHttp().getRequest();
        const ability = this.caslAbilityFactory.createForUser(request.user);

        return policyHandlers.every((handler) =>
            handler.handle(ability, request),
        );
    }
}