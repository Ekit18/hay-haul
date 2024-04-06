import { Body, Controller, Post, Req, Res } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Request, Response } from 'express';
import { SendOtpDto } from 'src/auth/dto/send-otp.dto';
import { EmailErrorMessage } from 'src/email/enums/email-error-message.enum';
import { getSwaggerResponseDescription } from 'src/lib/helpers/getSwaggerResponseDescription';
import { TokenErrorMessage } from 'src/token/token-error-message.enum';
import { RegisterUserDto } from 'src/user/dto/register-user.dto';
import { UserErrorMessage } from 'src/user/user-error-message.enum';
import { AuthErrorMessage } from './auth-error-message.enum';
import { AuthService } from './auth.service';
import { CheckUserEmailDto } from './dto/check-user-email.dto';
import { ConfirmResetPasswordDto } from './dto/confirm-reset-password.dto';
import { Login } from './dto/login.dto';
import { NewOtpDto } from './dto/new-otp.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiOperation({ summary: 'Login' })
  @ApiCreatedResponse({ description: 'Successful login' })
  @ApiBadRequestResponse({
    description: getSwaggerResponseDescription(
      UserErrorMessage.FailedToGetUser,
      AuthErrorMessage.UserNotFound,
      AuthErrorMessage.WrongPassEmail,
      TokenErrorMessage.FailedToGenerateTokens,
    ),
  })
  @Post('/login')
  async login(
    @Body() userDto: Login,
    @Res({ passthrough: true }) response: Response,
    @Req() request: Request,
  ) {
    const data = await this.authService.login(userDto, response, request);
    response.json(data);
  }

  @ApiOperation({ summary: 'Register' })
  @ApiCreatedResponse({ description: 'Successful registration' })
  @ApiBadRequestResponse({
    description: getSwaggerResponseDescription(
      UserErrorMessage.FailedToGetUser,
      UserErrorMessage.FailedToCreateUser,
      AuthErrorMessage.UserNotFound,
      TokenErrorMessage.FailedToGenerateTokens,
      AuthErrorMessage.UserWithEmailAlreadyExists,
    ),
  })
  @Post('/registration')
  async registration(
    @Body() userDto: RegisterUserDto,
    @Res({ passthrough: true }) response: Response,
    @Req() request: Request,
  ) {
    const data = await this.authService.registration(
      userDto,
      response,
      request,
    );
    response.json(data);
  }

  @ApiOperation({ summary: 'Refresh expired access token' })
  @ApiCreatedResponse({ description: 'Successful token refresh' })
  @ApiBadRequestResponse({
    description: getSwaggerResponseDescription(
      TokenErrorMessage.FailedToGetRefreshToken,
      UserErrorMessage.FailedToGetUser,
      TokenErrorMessage.FailedToGenerateTokens,
    ),
  })
  @ApiUnauthorizedResponse({
    description: getSwaggerResponseDescription(
      AuthErrorMessage.NoRefreshToken,
      AuthErrorMessage.TokenExpired,
      AuthErrorMessage.InvalidRefreshToken,
    ),
  })
  @ApiBearerAuth()
  @Post('/refresh')
  async refresh(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ) {
    const data = await this.authService.refresh(request, response);
    response.json(data);
  }

  @ApiOperation({
    summary: 'Verify OTP for registration or password reset',
  })
  @ApiCreatedResponse({ description: 'Successful otp verification' })
  @ApiBadRequestResponse({
    description: getSwaggerResponseDescription(
      AuthErrorMessage.UserNotFound,
      AuthErrorMessage.OtpNotFound,
      AuthErrorMessage.InvalidOtp,
      UserErrorMessage.FailedToUpdateUser,
      UserErrorMessage.FailedToGetUser,
      TokenErrorMessage.FailedToGenerateTokens,
    ),
  })
  @Post('/verify-otp')
  async verifyOtp(
    @Body() otpDto: SendOtpDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const data = await this.authService.verifyOtp(otpDto, response);
    response.json(data);
  }

  @ApiOperation({ summary: 'Request password reset to get OTP code' })
  @ApiCreatedResponse({ description: 'Password reset requested successfully' })
  @ApiInternalServerErrorResponse({
    description: getSwaggerResponseDescription(
      EmailErrorMessage.FailedSendEmail,
    ),
  })
  @ApiBadRequestResponse({
    description: getSwaggerResponseDescription(
      AuthErrorMessage.InvalidOtpType,
      AuthErrorMessage.UserNotFound,
      UserErrorMessage.FailedToGetUser,
    ),
  })
  @Post('/request-reset-password')
  async requestResetPassword(@Body() dto: NewOtpDto) {
    return await this.authService.requestResetPassword(dto);
  }

  @ApiOperation({ summary: 'Renew OTP if expired' })
  @ApiCreatedResponse({ description: 'OTP has been renewed successfully' })
  @ApiBadRequestResponse({
    description: getSwaggerResponseDescription(
      AuthErrorMessage.UserNotFound,
      UserErrorMessage.FailedToGetUser,
      AuthErrorMessage.UserAlreadyVerified,
      AuthErrorMessage.OtpNotFound,
    ),
  })
  @Post('/renew-otp')
  async renewOtp(@Body() dto: NewOtpDto) {
    return await this.authService.renewOtp(dto);
  }

  @ApiOperation({ summary: 'Check if user exists by email' })
  @ApiCreatedResponse({ description: 'User checked successfully' })
  @ApiBadRequestResponse({ description: UserErrorMessage.FailedToGetUser })
  @Post('/check-email')
  async checkUserEmail(@Body() dto: CheckUserEmailDto) {
    return await this.authService.checkUserEmail(dto);
  }

  @ApiOperation({ summary: 'Confirm password reset' })
  @ApiCreatedResponse({
    description: 'Password reset has been confirmed successfully',
  })
  @ApiBadRequestResponse({
    description: getSwaggerResponseDescription(
      AuthErrorMessage.InvalidOtpType,
      AuthErrorMessage.UserNotFound,
      UserErrorMessage.FailedToGetUser,
      AuthErrorMessage.OtpNotFound,
      UserErrorMessage.FailedToUpdateUser,
    ),
  })
  @Post('/confirm-reset-password')
  async confirmResetPassword(@Body() dto: ConfirmResetPasswordDto) {
    return await this.authService.confirmResetPassword(dto);
  }
}
