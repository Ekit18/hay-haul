import { Reflector } from '@nestjs/core';
import { AppAbility } from '../casl/casl-ability.factory';
import { ArgumentsHost, Type } from '@nestjs/common';
import { AuthenticatedRequest } from 'src/lib/types/user.request.type';

export interface IPolicyHandler {
    handle(ability: AppAbility, request: AuthenticatedRequest): boolean | Promise<boolean>;
}

export const CheckPolicies = Reflector.createDecorator<Type<IPolicyHandler>[]>()