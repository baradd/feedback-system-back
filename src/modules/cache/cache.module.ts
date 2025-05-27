import { Global, Module } from '@nestjs/common';
import { RedisConfigModule } from 'src/config/redis/redis-config.module';
import { RedisConfigService } from 'src/config/redis/redis-config.service';
import * as redisStore from 'cache-manager-ioredis';
import { redisClientFactory } from 'src/config/redis/redis.factory';
import { CacheRepository } from './cache.repository';
import { CacheService } from './cache.service';

@Global()
@Module({
  imports: [RedisConfigModule],
  providers: [CacheService, redisClientFactory, CacheRepository],
  exports: [CacheService],
})
export class CacheModule {}
