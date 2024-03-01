import { Body, Controller, Post, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { SendOtpDto } from 'src/auth/dto/send-otp.dto';
import { RegisterUserDto } from 'src/user/dto/register-user.dto';
import { AuthService } from './auth.service';
import { CheckUserEmailDto } from './dto/check-user-email.dto';
import { ConfirmResetPasswordDto } from './dto/confirm-reset-password.dto';
import { Login } from './dto/login.dto';
import { NewOtpDto } from './dto/new-otp.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/login')
  async login(
    @Body() userDto: Login,
    @Res({ passthrough: true }) response: Response,
  ) {
    const data = await this.authService.login(userDto, response);
    response.json(data);
  }

  @Post('/registration')
  async registration(
    @Body() userDto: RegisterUserDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const data = await this.authService.registration(userDto, response);
    response.json(data);
  }

  @Post('/refresh')
  async refresh(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ) {
    const data = await this.authService.refresh(request, response);
    response.json(data);
  }

  @Post('/verify-otp')
  async verifyOtp(
    @Body() otpDto: SendOtpDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const data = await this.authService.verifyOtp(otpDto, response);
    response.json(data);
  }

  @Post('/request-reset-password')
  async requestResetPassword(@Body() dto: NewOtpDto) {
    return await this.authService.requestResetPassword(dto);
  }

  @Post('/renew-otp')
  async renewOtp(@Body() dto: NewOtpDto) {
    return await this.authService.renewOtp(dto);
  }

  @Post('/check-email')
  async checkUserEmail(@Body() dto: CheckUserEmailDto) {
    return await this.authService.checkUserEmail(dto);
  }

  @Post('/confirm-reset-password')
  async confirmResetPassword(@Body() dto: ConfirmResetPasswordDto) {
    return await this.authService.confirmResetPassword(dto);
  }
}
