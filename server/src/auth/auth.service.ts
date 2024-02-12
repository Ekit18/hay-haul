import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { compare, hash } from 'bcrypt';
import { Request, Response } from 'express';
import { FacilityDetailsService } from 'src/facility-details/facility-details.service';
import { ProductTypeService } from 'src/product-type/product-type.service';
import { TokenTypeEnum } from 'src/token/token-type.enum';
import { TokenService } from 'src/token/token.service';
import { TokenData } from 'src/token/token.type';
import { RegisterUserDto } from 'src/user/dto/register-user.dto';
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
    private facilityDetailsService: FacilityDetailsService,
    private productTypeService: ProductTypeService,
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
    registerUserDto: RegisterUserDto,
    response: Response,
  ): Promise<RegistrationResponseDto> {
    try {
      const candidate = await this.userService.getUserByEmail(
        registerUserDto.email,
      );

      if (candidate) {
        throw new HttpException(
          { message: AuthErrorMessage.UserWithEmailAlreadyExists },
          HttpStatus.BAD_REQUEST,
        );
      }

      const hashPassword = await hash(registerUserDto.password, 5);

      const user = await this.userService.create({
        email: registerUserDto.email,
        fullName: registerUserDto.fullName,
        role: registerUserDto.role,
        password: hashPassword,
      });

      //TODO:
      // Create facilityDetails
      const facilityDetails = await this.facilityDetailsService.create(
        {
          facilityAddress: registerUserDto.facilityAddress,
          facilityName: registerUserDto.facilityName,
          facilityOfficialCode: registerUserDto.facilityOfficialCode,
        },
        user,
      );
      // Create farm products
      const productTypes = await this.productTypeService.createMany(
        registerUserDto.farmProductTypes,
        facilityDetails,
      );

      console.log('productTypes', productTypes);
      console.log('facilityDetails', facilityDetails);

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
