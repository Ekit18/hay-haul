import { Body, Controller, Post, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { AuthService } from './auth.service';
import { Login } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/login')
  login(@Body() userDto: Login, @Res() response: Response) {
    return this.authService.login(userDto, response);
  }

  @Post('/registration')
  registration(@Body() userDto: CreateUserDto, @Res() response: Response) {
    return this.authService.registration(userDto, response);
  }

  @Post('/refresh')
  refresh(@Req() request: Request) {
    return this.authService.refresh(request);
  }
}
