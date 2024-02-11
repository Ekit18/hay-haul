import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { TokenService } from 'src/token/token.service';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { User } from 'src/user/user.entity';
import { UserService } from 'src/user/user.service';
import { AuthErrorMessage } from './auth-error-message.enum';
import { Login } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private tokenService: TokenService,
  ) {}

  async login(userDto: Login) {
    try {
      const user = await this.validateRegularUser(userDto);
      return this.generateToken(user);
    } catch (error) {
      throw new HttpException(
        { message: AuthErrorMessage.WrongPassEmail },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async registration(userDto: CreateUserDto) {
    try {
      const candidate = await this.userService.getUserByEmail(userDto.email);
      if (candidate) {
        throw new HttpException(
          { message: AuthErrorMessage.UserWithEmailAlreadyExists },
          HttpStatus.BAD_REQUEST,
        );
      }
      const hashPassword = await bcrypt.hash(userDto.password, 5);
      const user = await this.userService.create({
        ...userDto,
        password: hashPassword,
      });
      return this.generateToken(user);
    } catch (error) {
      throw new HttpException(
        { message: error.message },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  private generateToken(user: User) {
    const payload = { email: user.email, id: user.id };
    return {
      token: this.jwtService.sign(payload),
    };
  }

  private async validateRegularUser(userDto: Login) {
    try {
      const user = await this.userService.getUserByEmail(userDto.email);

      if (!user) {
        throw new UnauthorizedException({
          message: AuthErrorMessage.UserNotFound,
        });
      }

      const passwordEquals = await bcrypt.compare(
        userDto.password,
        user.password,
      );

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
