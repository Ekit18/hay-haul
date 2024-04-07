import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { ALLOWED_ROLES_KEY } from 'src/lib/decorators/roles-auth.decorator';
import { AuthenticatedRequest } from 'src/lib/types/user.request.type';
import { TokenTypeEnum } from 'src/token/token-type.enum';
import { TokenService } from 'src/token/token.service';
import { UserRole } from 'src/user/user.entity';
import { AuthErrorMessage } from './auth-error-message.enum';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private tokenService: TokenService,
    private reflector: Reflector,
  ) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const req = context.switchToHttp().getRequest() as AuthenticatedRequest;
    try {
      const authHeader = req.headers.authorization;
      const bearer = authHeader.split(' ')[0];
      const token = authHeader.split(' ')[1];

      if (bearer !== 'Bearer' || !token) {
        throw new UnauthorizedException({
          message: AuthErrorMessage.UserNotAuthorized,
        });
      }

      const user = this.tokenService.checkToken(token, TokenTypeEnum.ACCESS);

      req.user = user;

      const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(
        ALLOWED_ROLES_KEY,
        [context.getHandler(), context.getClass()],
      );

      if (requiredRoles) {
        return requiredRoles.includes(user.role);
      }

      return true;
    } catch (e) {
      throw new UnauthorizedException({
        message: AuthErrorMessage.UserNotAuthorized,
      });
    }
  }
}
