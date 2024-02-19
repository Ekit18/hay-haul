import { Body, Controller, Post, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { SendOtpDto } from 'src/auth/dto/send-otp.dto';
import { RegisterUserDto } from 'src/user/dto/register-user.dto';
import { AuthService } from './auth.service';
import { Login } from './dto/login.dto';
import { NewOtpDto } from './dto/new-otp.dto';
import { ResetUserDto } from './dto/reset-user.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/login')
  async login(@Body() userDto: Login, @Res() response: Response) {
    const data = await this.authService.login(userDto, response);
    response.json(data);
  }

  @Post('/registration')
  async registration(
    @Body() userDto: RegisterUserDto,
    @Res() response: Response,
  ) {
    const data = await this.authService.registration(userDto, response);
    response.json(data);
  }

  @Post('/refresh')
  async refresh(@Req() request: Request, @Res() response: Response) {
    const data = await this.authService.refresh(request, response);
    response.json(data);
  }
  //GOVNOKOD!!!!!!!!
  //@UseGuards(JwtAuthGuard)
  @Post('/verify-otp')
  async verifyOtp(@Body() otpDto: SendOtpDto) {
    return await this.authService.verifyOtp(otpDto);
  }

  @Post('/reset-password')
  async resetPassword(@Body() resetUserDto: ResetUserDto) {
    return await this.authService.resetPassword(resetUserDto);
  }
  //GOVNOKOD!!!!!!!!
  // @UseGuards(JwtAuthGuard)
  @Post('/new-otp')
  async getNewOtp(@Body() newOtpDto: NewOtpDto) {
    return await this.authService.getNewOtp(newOtpDto);
  }
}
