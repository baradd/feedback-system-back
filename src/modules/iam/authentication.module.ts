import { Module } from '@nestjs/common';
import { BCryptService } from 'src/common/providers/bcrypt.service';
import { AuthenticationService } from './authentication.service';
import { UserModule } from '../user/user.module';
import { JwtModule, JwtService } from '@nestjs/jwt';
import jwtConfig from './auth/config/jwt.config';
import { ConfigModule } from '@nestjs/config';
import { CacheModule } from '../cache/cache.module';
import { AuthenticationController } from './authentication.controller';

@Module({
  imports: [
    UserModule,
    JwtModule.registerAsync(jwtConfig.asProvider()),
    ConfigModule.forFeature(jwtConfig),
    CacheModule,
  ],
  controllers: [AuthenticationController],
  providers: [BCryptService, AuthenticationService],
  exports: [],
})
export class AuthenticationModule {}
