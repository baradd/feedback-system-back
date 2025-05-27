import { Body, Controller, Post } from '@nestjs/common';
import { UserModel } from '../user/models/user.model';
import { AuthenticationService } from './authentication.service';
import { RegisterDto } from './dtos/register.dto';
import { ApiTags } from '@nestjs/swagger';

@Controller('auth')
export class AuthenticationController {
  constructor(private readonly authenticationService: AuthenticationService) {}

  @Post('register')
  async register(@Body() registerDto: RegisterDto): Promise<UserModel> {
    return this.authenticationService.register(registerDto);
  }
}
