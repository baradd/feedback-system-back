import { Body, Controller, Post, Req } from '@nestjs/common';
import { UserModel } from '../user/models/user.model';
import { AuthenticationService } from './authentication.service';
import { RegisterDto } from './dtos/register.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { LoginDto } from './dtos/login.dto';
import { Request } from 'express';
import { RefreshTokenDto } from './dtos/refresh-token.dto';
import { SkipAuth } from 'src/common/guards/skip-auth.guard';
import { ActiveUser } from 'src/common/decorators/active-user.decorator';
import { IActiveUserData } from 'src/common/interfaces/active-user-data';

@Controller('auth')
export class AuthenticationController {
  constructor(private readonly authenticationService: AuthenticationService) { }

  @SkipAuth()
  @Post('register')
  async register(@Body() registerDto: RegisterDto): Promise<UserModel> {
    return this.authenticationService.register(registerDto);
  }

  @SkipAuth()
  @Post('login')
  async login(
    @Body() loginDto: LoginDto,
    @Req() req: Request,
  ): Promise<{ token: string; refreshToken: string }> {
    return this.authenticationService.login(loginDto);
  }

  @SkipAuth()
  @Post('refresh-tokens')
  async refreshTokens(@Body() body: RefreshTokenDto) {
    return this.authenticationService.refreshTokens(body.refreshToken);
  }

  @ApiBearerAuth('token')
  @Post('logout')
  async logout(@ActiveUser() activeUser: IActiveUserData) {
    return this.authenticationService.logout(activeUser)
  }
}
