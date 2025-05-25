import { DeepPartial } from "typeorm";
import { UserModel } from "../user/models/user.model";
import { BCryptService } from "src/common/providers/bcrypt.service";
import { JwtService } from "@nestjs/jwt";
import { Inject } from "@nestjs/common";
import jwtConfig from "./auth/config/jwt.config";
import { ConfigType } from "@nestjs/config";

export class AuthenticationService {
    constructor(private readonly bcryptService: BCryptService,
        private readonly jwtService: JwtService,
        @Inject(jwtConfig.KEY)
        private readonly jwtConfiguration: ConfigType<typeof jwtConfig>
    ) { }

    async generateTokens(user: DeepPartial<UserModel>): Promise<{ token: string, refreshToken: string }> {
        return
    }

    async signToken<T>(payload: T): Promise<string> {
        return this.jwtService.signAsync({ payload }, {
            secret: this.jwtConfiguration.JWT_SECRET,
            expiresIn: this.jwtConfiguration.JWT_EXPIRATION,
            issuer: this.jwtConfiguration.JWT_ISSUER,
            audience: this.jwtConfiguration.JWT_AUDIENCE
        })
    }
}