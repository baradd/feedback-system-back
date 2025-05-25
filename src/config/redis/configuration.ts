import { registerAs } from '@nestjs/config';

export default registerAs('redis', () => ({
  REDIS_HOST: process.env.REDIS_HOST || 'localhost',
  REDIS_PORT: parseInt(process.env.REDIS_PORT, 10) || 6379,
  REDIS_PASSWORD: process.env.REDIS_PASSWORD || '',
  REDIS_DB: parseInt(process.env.REDIS_DB, 10) || 0,
  REDIS_TTL: parseInt(process.env.REDIS_TTL, 10) || 3600,
}));
