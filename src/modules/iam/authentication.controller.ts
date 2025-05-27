import { Body, Controller, Post, Req } from '@nestjs/common';
import { UserModel } from '../user/models/user.model';
import { AuthenticationService } from './authentication.service';
import { RegisterDto } from './dtos/register.dto';
import { ApiTags } from '@nestjs/swagger';
import { LoginDto } from './dtos/login.dto';
import { Request } from 'express';

@Controller('auth')
export class AuthenticationController {
  constructor(private readonly authenticationService: AuthenticationService) {}

  @Post('register')
  async register(@Body() registerDto: RegisterDto): Promise<UserModel> {
    return this.authenticationService.register(registerDto);
  }

  @Post('login')
  async login(
    @Body() loginDto: LoginDto,
    @Req() req: Request,
  ): Promise<{ token: string; refreshToken: string }> {
    return this.authenticationService.login(loginDto);
  }
}
