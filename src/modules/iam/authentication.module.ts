import { Module } from '@nestjs/common';
import { BCryptService } from 'src/common/providers/bcrypt.service';
import { AuthenticationService } from './authentication.service';
import { UserModule } from '../user/user.module';
import { JwtModule, JwtService } from '@nestjs/jwt';
import jwtConfig from './auth/config/jwt.config';
import { ConfigModule } from '@nestjs/config';
import { CacheModule } from '../cache/cache.module';
import { AuthenticationController } from './authentication.controller';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './auth/guards/auth.guard';

@Module({
  imports: [
    UserModule,
    JwtModule.registerAsync(jwtConfig.asProvider()),
    ConfigModule.forFeature(jwtConfig),
    CacheModule,
  ],
  controllers: [AuthenticationController],
  providers: [BCryptService, AuthenticationService, { provide: APP_GUARD, useClass: AuthGuard }, AuthGuard],
  exports: [],
})
export class AuthenticationModule { }
