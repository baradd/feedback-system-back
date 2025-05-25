import { Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { RedisConfigModule } from 'src/config/redis/redis-config.module';
import { RedisConfigService } from 'src/config/redis/redis-config.service';
import * as redisStore from 'cache-manager-ioredis';

@Module({
  imports: [
    CacheModule.registerAsync({
      imports: [RedisConfigModule],
      inject: [RedisConfigService],
      useFactory: (config: RedisConfigService) => ({
        store: [redisStore],
        host: config.host,
        port: config.port,
        ttl: config.ttl,
      }),
      isGlobal: true,
    }),
  ],
})
export class CustomCacheModule { }
