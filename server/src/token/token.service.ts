import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/user.entity';
import { Repository } from 'typeorm';
import { TokenErrorMessage } from './token-error-message.enum';
import { Token } from './token.entity';
import { Tokens } from './token.type';

@Injectable()
export class TokenService {
  private readonly jwtRefreshTokenSecret = this.configService.get<string>(
    'JWT_REFRESH_TOKEN_SECRET',
  );
  private readonly jwtAccessTokenSecret = this.configService.get<string>(
    'JWT_ACCESS_TOKEN_SECRET',
  );
  private readonly jwtRefreshTokenExpireTime = this.configService.get<string>(
    'JWT_REFRESH_TOKEN_EXPIRE',
  );
  private readonly jwtAccessTokenExpireTime = this.configService.get<string>(
    'JWT_ACCESS_TOKEN_EXPIRE',
  );

  public constructor(
    @InjectRepository(Token)
    private readonly tokenRepository: Repository<Token>,
    private jwtService: JwtService,
    private configService: ConfigService,
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
      const payload = { email: user.email, id: user.id };
      const refreshToken = this.jwtService.sign(payload, {
        secret: this.jwtRefreshTokenSecret,
        expiresIn: this.jwtRefreshTokenExpireTime,
      });

      const accessToken = this.jwtService.sign(payload, {
        secret: this.jwtAccessTokenSecret,
        expiresIn: this.jwtAccessTokenExpireTime,
      });

      await this.tokenRepository.save({ userId: user.id, refreshToken });

      return { refreshToken, accessToken };
    } catch (error) {
      throw new HttpException(
        TokenErrorMessage.FailedToGenerateTokens,
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
