import { DeepPartial } from 'typeorm';
import { UserModel } from '../user/models/user.model';
import { BCryptService } from 'src/common/providers/bcrypt.service';
import { JwtService } from '@nestjs/jwt';
import { BadRequestException, Inject } from '@nestjs/common';
import jwtConfig from './auth/config/jwt.config';
import { ConfigType } from '@nestjs/config';
import { UserService } from '../user/user.service';
import { randomUUID } from 'crypto';
import { IActiveUserData } from 'src/common/interfaces/active-user-data';
import { CacheService } from '../cache/cache.service';
import { RedisPrefixes } from 'src/common/enums/app.enum';
import { RegisterDto } from './dtos/register.dto';

export class AuthenticationService {
  constructor(
    private readonly bcryptService: BCryptService,
    private readonly jwtService: JwtService,
    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,
    private readonly userService: UserService,
    private readonly cacheService: CacheService,
  ) {}

  async register(registerDto: RegisterDto): Promise<UserModel> {
    const { firstname, lastname, email, password } = registerDto;

    const userExists = await this.userService.find({
      search: { email },
      limit: 1,
      page: 0,
    });

    if (userExists.data.length > 0) {
      throw new BadRequestException('User with this email already exists');
    }

    const user = await this.userService.create({
      firstname,
      lastname,
      email,
      phone: registerDto.phone,
      password: await this.bcryptService.hash(password),
    });

    return { ...user, password: undefined } as UserModel;
  }

  async generateTokens(
    user: DeepPartial<UserModel>,
  ): Promise<{ token: string; refreshToken: string }> {
    const refreshTokenId = randomUUID();
    const [token, refreshToken] = await Promise.all([
      this.signToken<IActiveUserData>(
        user.id,
        this.jwtConfiguration.accessTokenExpireIn,
        user as IActiveUserData,
      ),
      this.signToken<string>(
        user.id,
        this.jwtConfiguration.refreshTokenExpireIn,
        refreshTokenId,
      ),
    ]);

    await this.cacheService.sadd(RedisPrefixes.TOKEN, user.id, token);

    await this.cacheService.sadd(
      RedisPrefixes.REFRESH_TOKEN,
      user.id,
      refreshToken,
    );

    return { token, refreshToken };
  }

  async signToken<T>(
    id: string,
    expiration: number,
    payload: T,
  ): Promise<string> {
    return this.jwtService.signAsync(
      {
        id,
        ...payload,
      },
      {
        secret: this.jwtConfiguration.secret,
        expiresIn: expiration,
        issuer: this.jwtConfiguration.issuer,
        audience: this.jwtConfiguration.audience,
      },
    );
  }
}
