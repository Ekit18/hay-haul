import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { compare, hash } from 'bcrypt';
import { Request, Response } from 'express';
import { SendOtpDto } from 'src/auth/dto/send-otp.dto';
import { EmailService } from 'src/email/services/email.service';
import { FacilityDetailsService } from 'src/facility-details/facility-details.service';
import { OtpDataType, OtpType } from 'src/lib/enums/enums';
import { ProductTypeService } from 'src/product-type/product-type.service';
import { TokenTypeEnum } from 'src/token/token-type.enum';
import { TokenService } from 'src/token/token.service';
import { TokenData } from 'src/token/token.type';
import { RegisterUserDto } from 'src/user/dto/register-user.dto';
import { User } from 'src/user/user.entity';
import { UserService } from 'src/user/user.service';
import { Repository } from 'typeorm';
import { AuthErrorMessage } from './auth-error-message.enum';
import { Login } from './dto/login.dto';
import { NewOtpDto } from './dto/new-otp.dto';
import { RegistrationResponseDto } from './dto/registration-response.dto';
import { ResetUserDto } from './dto/reset-user.dto';
import { generateOtpCode } from './helpers/generate-otp-code.helper';
import { Otp } from './otp.entity';

@Injectable()
export class AuthService {
  private readonly verifyAccountOtpTemplateId = this.configService.get<string>(
    'SENDGRID_VERIFY_ACCOUNT_OTP_TEMPLATE_ID',
  );

  private readonly updatePasswordOtpTemplateId = this.configService.get<string>(
    'SENDGRID_UPDATE_USER_PASSWORD_OTP_TEMPLATE_ID',
  );

  constructor(
    private readonly userService: UserService,
    private readonly tokenService: TokenService,
    private readonly facilityDetailsService: FacilityDetailsService,
    private readonly emailService: EmailService,
    private readonly configService: ConfigService,
    private readonly productTypeService: ProductTypeService,
    @InjectRepository(Otp) private readonly otpRepository: Repository<Otp>,
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

      const facilityDetails = await this.facilityDetailsService.create(
        {
          facilityAddress: registerUserDto.facilityAddress,
          facilityName: registerUserDto.facilityName,
          facilityOfficialCode: registerUserDto.facilityOfficialCode,
        },
        user,
      );

      const productTypes = await this.productTypeService.createMany(
        registerUserDto.farmProductTypes,
        facilityDetails,
      );
      console.log('user', user);
      console.log('productTypes', productTypes);
      console.log('facilityDetails', facilityDetails);

      const { refreshToken, accessToken } =
        await this.tokenService.generateTokens(user);

      response.cookie('refreshToken', refreshToken);
      const otp = generateOtpCode();
      console.log('otp', otp);
      await this.otpRepository.save({
        otp,
        user,
        isVerified: false,
        type: OtpType.REGISTER,
      });

      await this.emailService.sendEmail({
        to: user.email,
        templateId: this.verifyAccountOtpTemplateId,
        dynamicTemplateData: {
          otpCode: otp,
        },
      });
      return { accessToken };
    } catch (error) {
      console.log(error);
      throw new HttpException(
        { message: error.message },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  public async resetPassword(resetUserDto: ResetUserDto) {
    const user = await this.userService.getUserByEmail(resetUserDto.email);
    if (!user) {
      throw new HttpException(
        { message: AuthErrorMessage.UserNotFound },
        HttpStatus.BAD_REQUEST,
      );
    }
    const otp = generateOtpCode();
    console.log('otp', otp);
    try {
      await this.otpRepository.save({
        otp,
        user,
        isVerified: false,
        type: OtpType.FORGOT_PASSWORD,
      });
    } catch (error) {
      throw new HttpException(
        { message: error.message },
        HttpStatus.BAD_REQUEST,
      );
    }

    await this.emailService.sendEmail({
      to: user.email,
      templateId: this.updatePasswordOtpTemplateId,
      dynamicTemplateData: {
        otpCode: otp,
      },
    });
  }

  async verifyOtp(otp: SendOtpDto) {
    try {
      const userId = await this.getUserIdFromDto(otp);
      console.log('userId', userId);
      const otpFromDb = await this.otpRepository
        .createQueryBuilder('otp')
        .where('otp.userId = :userId', { userId })
        .getOne();
      console.log('otpFromDb', otpFromDb);

      if (!otpFromDb) {
        throw new HttpException(
          { message: AuthErrorMessage.OtpNotFound },
          HttpStatus.BAD_REQUEST,
        );
      }
      if (otpFromDb.otp !== otp.otp) {
        throw new HttpException(
          { message: AuthErrorMessage.InvalidOtp },
          HttpStatus.BAD_REQUEST,
        );
      }
      await this.otpRepository
        .createQueryBuilder()
        .delete()
        .from(Otp)
        .where('id = :id', { id: otpFromDb.id })
        .execute();
      if (otpFromDb.type === OtpType.REGISTER) {
        await this.userService.update(otpFromDb.userId, { isVerified: true });
      }
    } catch (error) {
      throw new HttpException(
        { message: error.message },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async getUserIdFromDto(newOtpDto: Pick<NewOtpDto, 'userData' | 'dataType'>) {
    let userId = newOtpDto.userData;
    if (newOtpDto.dataType === OtpDataType.EMAIL) {
      const candidate = await this.userService.getUserByEmail(
        newOtpDto.userData,
      );
      if (!candidate) {
        throw new HttpException(
          { message: AuthErrorMessage.UserNotFound },
          HttpStatus.BAD_REQUEST,
        );
      }
      userId = candidate.id;
    }
    return userId;
  }

  async getNewOtp(newOtpDto: NewOtpDto) {
    try {
      const userId = await this.getUserIdFromDto(newOtpDto);

      const user = await this.userService.getUserById(userId);
      if (user.isVerified) {
        throw new HttpException(
          { message: AuthErrorMessage.UserAlreadyVerified },
          HttpStatus.BAD_REQUEST,
        );
      }

      const otp = await this.otpRepository.findOne({
        where: { userId, type: newOtpDto.type },
      });
      console.log('otp', otp);
      if (otp) {
        await this.otpRepository
          .createQueryBuilder()
          .delete()
          .from(Otp)
          .where('id = :id', { id: otp.id })
          .execute();
      }

      const newOtp = generateOtpCode();

      const newDbOtp = await this.otpRepository.save({
        otp: newOtp,
        userId,
        isVerified: false,
        type: newOtpDto.type,
      });

      await this.emailService.sendEmail({
        to: user.email,
        templateId: this.verifyAccountOtpTemplateId,
        dynamicTemplateData: {
          otpCode: newOtp,
        },
      });
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
