import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthErrorMessage } from 'src/auth/auth-error-message.enum';
import { TokenPayload } from 'src/lib/types/token-payload.type';
import { User, UserRole } from 'src/user/user.entity';
import { Repository } from 'typeorm';
import { TokenErrorMessage } from './token-error-message.enum';
import { TokenTypeEnum } from './token-type.enum';
import { Token } from './token.entity';
import { Tokens } from './token.type';

@Injectable()
export class TokenService {
  private readonly jwtRefreshTokenSecret = this.configService.get<string>(
    'JWT_REFRESH_TOKEN_SECRET',
  );
  private readonly jwtRefreshTokenExpire = this.configService.get<string>(
    'JWT_REFRESH_TOKEN_EXPIRE',
  );

  private readonly jwtAccessTokenSecret = this.configService.get<string>(
    'JWT_ACCESS_TOKEN_SECRET',
  );
  private readonly jwtAccessTokenExpire = this.configService.get<string>(
    'JWT_ACCESS_TOKEN_EXPIRE',
  );

  public constructor(
    @InjectRepository(Token)
    private readonly tokenRepository: Repository<Token>,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  public async getRefreshTokenByUserId(userId: string): Promise<Token> {
    try {
      return this.tokenRepository
        .createQueryBuilder('token')
        .where('token.userId = :userId', { userId })
        .getOne();
    } catch (error) {
      throw new HttpException(
        TokenErrorMessage.FailedToGetRefreshToken,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  public async generateTokens(user: User): Promise<Tokens> {
    try {
      const payload: TokenPayload = {
        email: user.email,
        id: user.id,
        isVerified: user.isVerified,
        fullName: user.fullName,
        role: user.role,
        ...([UserRole.Farmer, UserRole.Carrier].includes(user.role) &&
        user?.stripeEntry
          ? {
              payoutsEnabled: user.stripeEntry.payoutsEnabled,
              stripeAccountId: user.stripeEntry.accountId,
            }
          : {}),
      };

      const accessToken = this.jwtService.sign(payload, {
        expiresIn: this.jwtAccessTokenExpire,
        secret: this.jwtAccessTokenSecret,
      });
      const refreshToken = this.jwtService.sign(payload, {
        expiresIn: this.jwtRefreshTokenExpire,
        secret: this.jwtRefreshTokenSecret,
      });

      await this.tokenRepository.save(
        user.token?.id
          ? {
              id: user.token.id,
              userId: user.id,
              refreshToken,
            }
          : { userId: user.id, refreshToken },
      );

      return { refreshToken, accessToken };
    } catch (error) {
      throw new HttpException(
        TokenErrorMessage.FailedToGenerateTokens,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  public checkToken(token: string, tokenType: TokenTypeEnum): TokenPayload {
    try {
      switch (tokenType) {
        case TokenTypeEnum.ACCESS:
          return this.jwtService.verify<TokenPayload>(token, {
            secret: this.jwtAccessTokenSecret,
          });
        case TokenTypeEnum.REFRESH:
          return this.jwtService.verify<TokenPayload>(token, {
            secret: this.jwtRefreshTokenSecret,
          });
      }
    } catch (error) {
      throw new UnauthorizedException(AuthErrorMessage.TokenExpired);
    }
  }
}
