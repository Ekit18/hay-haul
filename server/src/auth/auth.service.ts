import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { compare, hash } from 'bcrypt';
import { Request, Response } from 'express';
import { TokenTypeEnum } from 'src/token/token-type.enum';
import { TokenService } from 'src/token/token.service';
import { TokenData } from 'src/token/token.type';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { User } from 'src/user/user.entity';
import { UserService } from 'src/user/user.service';
import { AuthErrorMessage } from './auth-error-message.enum';
import { Login } from './dto/login.dto';
import { RegistrationResponseDto } from './dto/registration-response.dto';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private tokenService: TokenService,
  ) {}

  async login(userDto: Login, response: Response) {
    try {
      const user = await this.validateRegularUser(userDto);
      const { refreshToken, accessToken } =
        await this.tokenService.generateTokens(user);
      response.cookie('refreshToken', refreshToken);
      return { accessToken };
    } catch (error) {
      throw new HttpException(
        { message: AuthErrorMessage.WrongPassEmail },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async refresh(request: Request, response: Response) {
    try {
      const refreshToken = request.cookies['refreshToken'];

      if (!refreshToken) {
        throw new UnauthorizedException({
          message: AuthErrorMessage.NoRefreshToken,
        });
      }

      const userData: TokenData | null = this.tokenService.checkToken(
        refreshToken,
        TokenTypeEnum.REFRESH,
      );

      const tokenFromDb = await this.tokenService.getRefreshTokenByUserId(
        userData.id,
      );

      if (tokenFromDb !== refreshToken) {
        throw new UnauthorizedException({
          message: AuthErrorMessage.InvalidRefreshToken,
        });
      }

      const user = await this.userService.getUserById(userData.id);

      const { accessToken, refreshToken: newRefreshToken } =
        await this.tokenService.generateTokens(user);

      response.cookie('refreshToken', newRefreshToken);
      return { accessToken };
    } catch (error) {
      throw new HttpException(
        { message: error.message },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async registration(
    userDto: CreateUserDto,
    response: Response,
  ): Promise<RegistrationResponseDto> {
    try {
      const candidate = await this.userService.getUserByEmail(userDto.email);

      if (candidate) {
        throw new HttpException(
          { message: AuthErrorMessage.UserWithEmailAlreadyExists },
          HttpStatus.BAD_REQUEST,
        );
      }

      const hashPassword = await hash(userDto.password, 5);

      const user = await this.userService.create({
        ...userDto,
        password: hashPassword,
      });

      const { refreshToken, accessToken } =
        await this.tokenService.generateTokens(user);

      response.cookie('refreshToken', refreshToken);

      return { accessToken };
    } catch (error) {
      throw new HttpException(
        { message: error.message },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  private async validateRegularUser(userDto: Login): Promise<User> {
    try {
      const user = await this.userService.getUserByEmail(userDto.email);

      if (!user) {
        throw new UnauthorizedException({
          message: AuthErrorMessage.UserNotFound,
        });
      }

      const passwordEquals = await compare(userDto.password, user.password);

      if (user && passwordEquals) {
        return user;
      }

      throw new UnauthorizedException({
        message: AuthErrorMessage.WrongPassEmail,
      });
    } catch (error) {
      throw new HttpException(
        { message: error.message },
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
