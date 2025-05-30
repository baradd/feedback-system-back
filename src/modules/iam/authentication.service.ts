import { DeepPartial } from 'typeorm';
import { UserModel } from '../user/models/user.model';
import { BCryptService } from 'src/common/providers/bcrypt.service';
import { JwtService } from '@nestjs/jwt';
import { BadRequestException, Inject, UnauthorizedException } from '@nestjs/common';
import jwtConfig from './auth/config/jwt.config';
import { ConfigType } from '@nestjs/config';
import { UserService } from '../user/user.service';
import { randomUUID } from 'crypto';
import { IActiveUserData } from 'src/common/interfaces/active-user-data';
import { CacheService } from '../cache/cache.service';
import { RedisPrefixes } from 'src/common/enums/app.enum';
import { RegisterDto } from './dtos/register.dto';
import { LoginDto } from './dtos/login.dto';
import { RefreshTokenDto } from './dtos/refresh-token.dto';

export class AuthenticationService {
  constructor(
    private readonly bcryptService: BCryptService,
    private readonly jwtService: JwtService,
    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,
    private readonly userService: UserService,
    private readonly cacheService: CacheService,
  ) { }

  async register(registerDto: RegisterDto): Promise<UserModel> {
    const { firstname, lastname, email, password } = registerDto;

    const userExists = await this.userService.findOne({
      email,
    });

    if (userExists) {
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

  async login(
    loginDto: LoginDto,
  ): Promise<{ token: string; refreshToken: string }> {
    const { email, password } = loginDto;
    const user = await this.userService.findOne({ email });

    if (!user) {
      throw new BadRequestException('Invalid username or password');
    }

    const isPasswordValid = this.bcryptService.compare(password, user.password);
    if (!isPasswordValid) {
      throw new BadRequestException('Invalid username or password');
    }

    const { id, firstname, lastname } = user;
    const tokens = await this.generateTokens({ id, firstname, lastname });

    return tokens;
  }

  async generateTokens(
    user: DeepPartial<UserModel>,
  ): Promise<{ token: string; refreshToken: string }> {
    const refreshTokenId = randomUUID();
    const tokenId = randomUUID()
    const newUser = { ...user, tokenId, refreshTokenId }
    const [token, refreshToken] = await Promise.all([
      this.signToken<IActiveUserData>(
        user.id,
        this.jwtConfiguration.accessTokenExpireIn,
        newUser as IActiveUserData,
      ),
      this.signToken<{ refreshTokenId: string }>(
        user.id,
        this.jwtConfiguration.refreshTokenExpireIn,
        { refreshTokenId },
      ),
    ]);

    await this.cacheService.sadd(RedisPrefixes.TOKEN, user.id, tokenId);

    await this.cacheService.sadd(
      RedisPrefixes.REFRESH_TOKEN,
      user.id,
      refreshTokenId,
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

  async refreshTokens(refreshToken: string) {
    try {
      const { id, refreshTokenId } = await this.jwtService.verifyAsync<
        Pick<IActiveUserData, 'id'> & { refreshTokenId: string }
      >(refreshToken, {
        audience: this.jwtConfiguration.audience,
        secret: this.jwtConfiguration.secret,
        issuer: this.jwtConfiguration.issuer,
      });

      const userRefreshTokenSet = await this.cacheService.smembers(RedisPrefixes.REFRESH_TOKEN, id)

      if (!userRefreshTokenSet.includes(refreshTokenId)) {
        throw new UnauthorizedException("Unauthorized");
      }

      const user = await this.userService.findById(id)
      const { id: userId, firstname, lastname } = user
      await this.invalidateTokens(RedisPrefixes.REFRESH_TOKEN, id, refreshTokenId)

      const tokens = await this.generateTokens({ id: userId, firstname, lastname })

      return tokens

    } catch (error) {
      throw error
    }
  }

  async invalidateTokens(prefix: string, key: string, value: string): Promise<void> {
    console.log('invalidating', prefix, key, value);

    await this.cacheService.srem(prefix, key, value)
  }

  async logout(activeUser: IActiveUserData): Promise<void> {
    await this.cacheService.srem(RedisPrefixes.TOKEN, activeUser.id, activeUser.tokenId);
    await this.cacheService.srem(RedisPrefixes.REFRESH_TOKEN, activeUser.id, activeUser.refreshTokenId);
  }
}
