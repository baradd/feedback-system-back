import { registerAs } from "@nestjs/config";

export default registerAs('jwt', () => ({
    JWT_SECRET: process.env.JWT_SECRET || 'default_secret',
    JWT_EXPIRATION: process.env.JWT_TOKEN_EXPIRATION || '1h',
    JWT_REFRESH_TOKEN_EXPIRATION: process.env.JWT_REFRESH_TOKEN_EXPIRATION || '1d',
    JWT_ISSUER: process.env.JWT_ISSUER || 'default_issuer',
    JWT_AUDIENCE: process.env.JWT_AUDIENCE || 'default_audience',
    JWT_NOT_BEFORE: process.env.JWT_NOT_BEFORE || '0',
    JWT_ID: process.env.JWT_ID || 'default_id',
}))