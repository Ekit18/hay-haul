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
import { OtpType } from 'src/lib/enums/enums';
import { TokenPayload } from 'src/lib/types/token-payload.type';
import { ProductTypeService } from 'src/product-type/product-type.service';
import { StripeService } from 'src/stripe/stripe.service';
import { TokenTypeEnum } from 'src/token/token-type.enum';
import { TokenService } from 'src/token/token.service';
import { RegisterUserDto } from 'src/user/dto/register-user.dto';
import { User, UserRole } from 'src/user/user.entity';
import { UserService } from 'src/user/user.service';
import { Repository } from 'typeorm';
import { AuthErrorMessage } from './auth-error-message.enum';
import { CheckUserEmailDto } from './dto/check-user-email.dto';
import { ConfirmResetPasswordDto } from './dto/confirm-reset-password.dto';
import { Login } from './dto/login.dto';
import { NewOtpDto } from './dto/new-otp.dto';
import { TokenResponse } from './dto/token-response.dto';
import { generateOtpCode } from './helpers/generate-otp-code.helper';
import { getCookieExpireDate } from './helpers/get-cookie-expire-date';
import { Otp } from './otp.entity';

@Injectable()
export class AuthService {
  private readonly verifyAccountOtpTemplateId = this.configService.get<string>(
    'SENDGRID_VERIFY_ACCOUNT_OTP_TEMPLATE_ID',
  );

  private readonly updatePasswordOtpTemplateId = this.configService.get<string>(
    'SENDGRID_UPDATE_USER_PASSWORD_OTP_TEMPLATE_ID',
  );

  private readonly jwtRefreshTokenExpire = this.configService.get<string>(
    'JWT_REFRESH_TOKEN_EXPIRE',
  );

  constructor(
    private readonly stripeService: StripeService,
    private readonly userService: UserService,
    private readonly tokenService: TokenService,
    private readonly facilityDetailsService: FacilityDetailsService,
    private readonly emailService: EmailService,
    private readonly configService: ConfigService,
    private readonly productTypeService: ProductTypeService,
    @InjectRepository(Otp) private readonly otpRepository: Repository<Otp>,
  ) {}

  async login(
    userDto: Login,
    response: Response,
    request: Request,
  ): Promise<TokenResponse> {
    const user = await this.validateRegularUser(userDto);

    const { refreshToken, accessToken } =
      await this.tokenService.generateTokens(user);
    response.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      expires: getCookieExpireDate(this.jwtRefreshTokenExpire),
    });

    // if ([UserRole.Farmer, UserRole.Carrier].includes(user.role)) {
    // const stripeAccount = await this.stripeService.createAccount({
    //   params: { type: 'standard', email: user.email },
    // });

    //   const stripeAccountLink = await this.stripeService.linkAccount({
    //     params: {
    //       account: stripeAccount.id,
    //       return_url: `${request.headers.origin}/return/${stripeAccount.id}`,
    //       refresh_url: `${request.headers.origin}/refresh/${stripeAccount.id}`,
    //       type: 'account_onboarding',
    //     },
    //   });

    //   await this.stripeService.createEntry({
    //     userId: user.id,
    //     accountId: stripeAccount.id,
    //     linkExpiresAt: new Date(stripeAccountLink.expires_at * 1000),
    //     linkUrl: stripeAccountLink.url,
    //   });

    //   return { accessToken };
    // }

    if ([UserRole.Farmer, UserRole.Carrier].includes(user.role)) {
      let stripeEntry = await this.stripeService.findOneByUserId(user.id);
      if (!stripeEntry) {
        const stripeAccount = await this.stripeService.createAccount({
          params: { type: 'standard', email: user.email },
        });
        const stripeAccountLink = await this.stripeService.linkAccount({
          params: {
            account: stripeAccount.id,
            return_url: `${request.headers.origin}/return/${stripeAccount.id}`,
            refresh_url: `${request.headers.origin}/refresh/${stripeAccount.id}`,
            type: 'account_onboarding',
          },
        });

        stripeEntry = await this.stripeService.createEntry({
          userId: user.id,
          accountId: stripeAccount.id,
          linkExpiresAt: new Date(stripeAccountLink.expires_at * 1000),
          linkUrl: stripeAccountLink.url,
        });
        // throw new UnauthorizedException({
        //   message: StripeErrorMessage.SellerStripeEntryNotFound,
        // });
      }
      if (
        !stripeEntry.payoutsEnabled &&
        stripeEntry.linkExpiresAt <= new Date()
      ) {
        await this.stripeService.recreateLinkByUserId(user.id, request);
      }
    }

    return { accessToken };
  }

  async refresh(request: Request, response: Response) {
    const refreshToken: string = request.cookies['refreshToken'];

    if (!refreshToken) {
      throw new UnauthorizedException({
        message: AuthErrorMessage.NoRefreshToken,
      });
    }

    const userData: TokenPayload | null = this.tokenService.checkToken(
      refreshToken,
      TokenTypeEnum.REFRESH,
    );

    const tokenFromDb = await this.tokenService.getRefreshTokenByUserId(
      userData.id,
    );

    if (tokenFromDb.refreshToken !== refreshToken) {
      throw new UnauthorizedException({
        message: AuthErrorMessage.InvalidRefreshToken,
      });
    }

    const user = await this.userService.getUserById(userData.id);

    const { accessToken, refreshToken: newRefreshToken } =
      await this.tokenService.generateTokens(user);

    response.cookie('refreshToken', newRefreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      expires: getCookieExpireDate(this.jwtRefreshTokenExpire),
    });
    return { accessToken };
  }

  async registration(
    registerUserDto: RegisterUserDto,
    response: Response,
    request: Request,
  ): Promise<TokenResponse> {
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
        address: registerUserDto.facilityAddress,
        name: registerUserDto.facilityName,
        code: registerUserDto.facilityOfficialCode,
      },
      user.id,
    );

    await this.productTypeService.createMany(
      registerUserDto.facilityProductTypes,
      facilityDetails,
    );

    const { refreshToken, accessToken } =
      await this.tokenService.generateTokens(user);

    response.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      expires: getCookieExpireDate(this.jwtRefreshTokenExpire),
    });

    const otp = generateOtpCode();

    await this.otpRepository.save({
      otp,
      user,
      isVerified: false,
      type: OtpType.REGISTER,
    });

    // await this.emailService.sendEmail({
    //   to: user.email,
    //   templateId: this.verifyAccountOtpTemplateId,
    //   dynamicTemplateData: {
    //     otpCode: otp,
    //   },
    // });
    return { accessToken };
  }

  public async requestResetPassword(requestResetPasswordDto: NewOtpDto) {
    if (requestResetPasswordDto.type !== OtpType.FORGOT_PASSWORD) {
      throw new HttpException(
        {
          message: AuthErrorMessage.InvalidOtpType,
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    const userId = await this.getUserIdFromDto(requestResetPasswordDto);
    const user = await this.userService.getUserById(userId);

    const otp = generateOtpCode();

    const newDbOtp = await this.otpRepository.save({
      otp,
      userId,
      type: requestResetPasswordDto.type,
    });

    await this.emailService.sendEmail({
      to: user.email,
      templateId: this.updatePasswordOtpTemplateId,
      dynamicTemplateData: {
        otpCode: otp,
      },
    });
  }

  public async confirmResetPassword(
    confirmResetPassword: ConfirmResetPasswordDto,
  ) {
    if (confirmResetPassword.type !== OtpType.FORGOT_PASSWORD) {
      throw new HttpException(
        {
          message: AuthErrorMessage.InvalidOtpType,
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    const userId = await this.getUserIdFromDto(confirmResetPassword);

    const otpFromDb = await this.otpRepository.exists({
      where: {
        userId: userId,
        type: confirmResetPassword.type,
        otp: confirmResetPassword.otp,
      },
    });
    if (!otpFromDb) {
      throw new HttpException(
        {
          message: AuthErrorMessage.OtpNotFound,
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    const user = await this.userService.getUserById(userId);

    const newHashedPassword = await hash(confirmResetPassword.password, 5);

    await this.userService.update(userId, { password: newHashedPassword });

    await this.otpRepository.delete({
      userId,
      type: confirmResetPassword.type,
    });
  }

  async verifyOtp(verifyOtpDto: SendOtpDto, response: Response) {
    const userId = await this.getUserIdFromDto(verifyOtpDto);
    console.log('userId', userId);

    const otpFromDb = await this.otpRepository
      .createQueryBuilder('otp')
      .where('otp.userId = :userId', { userId })
      .andWhere('otp.type = :type', { type: verifyOtpDto.type })
      .andWhere('otp.otp = :otp', { otp: verifyOtpDto.otp })
      .getOne();
    console.log('otpFromDb', otpFromDb);

    if (!otpFromDb) {
      throw new HttpException(
        { message: AuthErrorMessage.OtpNotFound },
        HttpStatus.BAD_REQUEST,
      );
    }

    if (otpFromDb.otp !== verifyOtpDto.otp) {
      throw new HttpException(
        { message: AuthErrorMessage.InvalidOtp },
        HttpStatus.BAD_REQUEST,
      );
    }

    if (otpFromDb.type === OtpType.REGISTER) {
      await this.otpRepository
        .createQueryBuilder()
        .delete()
        .from(Otp)
        .where('id = :id', { id: otpFromDb.id })
        .execute();

      await this.userService.update(otpFromDb.userId, { isVerified: true });

      const user = await this.userService.getUserById(otpFromDb.userId);

      const newTokens = await this.tokenService.generateTokens(user);

      response.cookie('refreshToken', newTokens.refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
        expires: getCookieExpireDate(this.jwtRefreshTokenExpire),
      });

      return { accessToken: newTokens.accessToken };
    }
  }

  async getUserIdFromDto(
    newOtpDto: Pick<NewOtpDto, 'email' | 'userId' | 'type'>,
  ) {
    if (newOtpDto.type === OtpType.FORGOT_PASSWORD) {
      const candidate = await this.userService.getUserByEmail(newOtpDto.email);

      if (!candidate) {
        throw new HttpException(
          { message: AuthErrorMessage.UserNotFound },
          HttpStatus.BAD_REQUEST,
        );
      }

      return candidate.id;
    }

    return newOtpDto.userId;
  }

  async renewOtp(newOtpDto: NewOtpDto) {
    console.log('newOtpDto', newOtpDto);
    const userId = await this.getUserIdFromDto(newOtpDto);

    const user = await this.userService.getUserById(userId);

    if (user.isVerified && newOtpDto.type === OtpType.REGISTER) {
      throw new HttpException(
        { message: AuthErrorMessage.UserAlreadyVerified },
        HttpStatus.BAD_REQUEST,
      );
    }

    const otp = await this.otpRepository.findOne({
      where: { userId, type: newOtpDto.type },
    });

    if (!otp) {
      throw new HttpException(
        { message: AuthErrorMessage.OtpNotFound },
        HttpStatus.BAD_REQUEST,
      );
    }

    console.log('otp', otp);
    await this.otpRepository
      .createQueryBuilder()
      .delete()
      .from(Otp)
      .where('id = :id', { id: otp.id })
      .execute();

    const newOtp = generateOtpCode();

    const newDbOtp = await this.otpRepository.save({
      otp: newOtp,
      userId,
      isVerified: false,
      type: newOtpDto.type,
    });

    // await this.emailService.sendEmail({
    //   to: user.email,
    //   templateId: this.verifyAccountOtpTemplateId,
    //   dynamicTemplateData: {
    //     otpCode: newOtp,
    //   },
    // });
  }

  private async validateRegularUser(userDto: Login): Promise<User> {
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
  }

  public async checkUserEmail(dto: CheckUserEmailDto) {
    const user = await this.userService.getUserByEmail(dto.email);

    return { userExist: !!user };
  }
}
