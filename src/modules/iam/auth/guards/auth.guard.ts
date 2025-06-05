import { CanActivate, ExecutionContext, Inject, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Request } from "express";
import { Observable } from "rxjs";
import jwtConfig from "../config/jwt.config";
import { ConfigType } from "@nestjs/config";
import { IActiveUserData } from "src/common/interfaces/active-user-data";
import { CacheService } from "src/modules/cache/cache.service";
import { RedisPrefixes } from "src/common/enums/app.enum";
import { Reflector } from "@nestjs/core";
import { IS_PUBLIC_KEY } from "src/common/guards/skip-auth.guard";

@Injectable()
export class AuthGuard implements CanActivate {

    constructor(private readonly jwtService: JwtService,
        @Inject(jwtConfig.KEY)
        private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,
        private readonly cacheService: CacheService,
        private readonly reflector: Reflector
    ) {
    }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest()

        const skipAuth = this.reflector.get<boolean>(IS_PUBLIC_KEY, context.getHandler())

        if (skipAuth)
            return true
        const token = this.extractTokenFromHeaders(request)

        if (!token) {
            throw new UnauthorizedException("Unauthorized");
        }
        let payload: IActiveUserData
        try {
            payload = await this.jwtService.verifyAsync(token,
                this.jwtConfiguration
            )
            const userTokenSet = await this.cacheService.smembers(RedisPrefixes.TOKEN, payload.id,)
            if (!userTokenSet.includes(payload.tokenId)) {
                throw new UnauthorizedException('Unauthorized')
            }
            request['user'] = payload
        } catch (error) {
            console.log(error);

            if (payload) {
                await this.cacheService.srem(RedisPrefixes.TOKEN, payload.id, payload.tokenId)
            }
            throw new UnauthorizedException('Unauthorized')
        }

        return true
    }

    extractTokenFromHeaders(request: Request): string | undefined {
        const [_, token] = request.headers.authorization?.split(' ') ?? [];
        return token;
    }
}