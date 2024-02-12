import { Body, Controller, Post, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { RegisterUserDto } from 'src/user/dto/register-user.dto';
import { AuthService } from './auth.service';
import { Login } from './dto/login.dto';

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
    console.log('REGISTRATION CONTROLLER');
    const data = await this.authService.registration(userDto, response);
    response.json(data);
  }

  @Post('/refresh')
  async refresh(@Req() request: Request, @Res() response: Response) {
    const data = await this.authService.refresh(request, response);
    response.json(data);
  }
}
