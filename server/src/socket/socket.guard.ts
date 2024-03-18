import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { WsException } from '@nestjs/websockets';
import { AuthErrorMessage } from 'src/auth/auth-error-message.enum';
import { AuthenticatedSocket } from 'src/lib/types/user.request.type';
import { TokenTypeEnum } from 'src/token/token-type.enum';
import { TokenService } from 'src/token/token.service';

@Injectable()
export class SocketAuthGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private tokenService: TokenService,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    try {
      const client = context.switchToWs().getClient() as AuthenticatedSocket;
      const rawToken = client.handshake.auth.token;
      const bearer = rawToken.split(' ')[0];
      const token = rawToken.split(' ')[1];

      if (bearer !== 'Bearer' || !token) {
        throw new WsException({
          message: AuthErrorMessage.UserNotAuthorized,
        });
      }

      const tokenData = this.tokenService.checkToken(
        token,
        TokenTypeEnum.ACCESS,
      );
      client.user = tokenData;
      return true;
    } catch (e) {
      throw new WsException({
        message: AuthErrorMessage.UserNotAuthorized,
      });
    }
  }
}
