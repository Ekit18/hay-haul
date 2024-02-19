import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';
import { ALLOWED_ROLES_KEY } from 'src/lib/decorators/roles-auth.decorator';
import { UserRole } from 'src/user/user.entity';
import { AuthErrorMessage } from './auth-error-message.enum';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  private readonly jwtAccessTokenSecret = this.configService.get<string>(
    'JWT_ACCESS_TOKEN_SECRET',
  );

  constructor(
    private jwtService: JwtService,
    private readonly configService: ConfigService,
    private reflector: Reflector,
  ) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const req = context.switchToHttp().getRequest();

    try {
      const authHeader = req.headers.authorization;
      const bearer = authHeader.split(' ')[0];
      const token = authHeader.split(' ')[1];

      if (bearer !== 'Bearer' || !token) {
        throw new UnauthorizedException({
          message: AuthErrorMessage.UserNotAuthorized,
        });
      }

      const user = this.jwtService.verify(token, {
        secret: this.jwtAccessTokenSecret,
      });

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
