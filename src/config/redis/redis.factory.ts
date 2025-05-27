import { FactoryProvider } from '@nestjs/common';
import Redis from 'ioredis';
import { RedisConfigService } from './redis-config.service';

export const redisClientFactory: FactoryProvider<Redis> = {
  provide: 'RedisClient',
  inject: [RedisConfigService],

  useFactory: (configService: RedisConfigService) => {
    const redisInstance = new Redis({
      host: configService.host,
      db: configService.db,
      password: configService.password,
      port: configService.port,
    });

    redisInstance.on('error', (e) => {
      throw new Error(`Redis connection failed: ${e}`);
    });
    return redisInstance;
  },
};
