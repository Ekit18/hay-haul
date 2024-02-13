import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';
import { AuthErrorMessage } from './auth-error-message.enum';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  private readonly jwtAccessTokenSecret = this.configService.get<string>(
    'JWT_ACCESS_TOKEN_SECRET',
  );

  constructor(
    private jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const req = context.switchToHttp().getRequest();
    console.log('GUARD');
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

      return true;
    } catch (e) {
      throw new UnauthorizedException({
        message: AuthErrorMessage.UserNotAuthorized,
      });
    }
  }
}
