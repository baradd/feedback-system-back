import { Inject, OnModuleDestroy } from '@nestjs/common';
import { ICacheRepository } from './cache-repository.interface';
import Redis from 'ioredis';

export class CacheRepository implements ICacheRepository, OnModuleDestroy {
  constructor(@Inject('RedisClient') private readonly redisClient: Redis) {}

  onModuleDestroy() {
    this.redisClient.disconnect();
  }

  async get(prefix: string, key: string): Promise<string | null> {
    return await this.redisClient.get(`${prefix}:${key}`);
  }

  async set(prefix: string, key: string, value: any): Promise<void> {
    await this.redisClient.set(`${prefix}:${key}`, value);
  }

  async delete(prefix: string, key: string): Promise<void> {
    await this.redisClient.del(`${prefix}:${key}`);
  }

  async setWithExpiry(
    prefix: string,
    key: string,
    value: any,
    expiry: number,
  ): Promise<void> {
    await this.redisClient.set(`${prefix}:${key}`, value, 'EX', expiry);
  }

  async exists(prefix: string, key: string): Promise<boolean> {
    const result = await this.redisClient.exists(`${prefix}:${key}`);
    return result === 1;
  }

  async getTtl(prefix: string, key: string): Promise<number> {
    return await this.redisClient.ttl(`${prefix}:${key}`);
  }

  //Add a member to a set
  async sadd(prefix: string, key: string, value: any): Promise<number> {
    return await this.redisClient.sadd(`${prefix}:${key}`, value);
  }

  //Get members of a set
  async smembers(prefix: string, key: string): Promise<string[]> {
    const members = await this.redisClient.smembers(`${prefix}:${key}`);
    return members || [];
  }

  //Remove a member from a set
  async srem(prefix: string, key: string, value: any): Promise<number> {
    return await this.redisClient.srem(`${prefix}:${key}`, value);
  }
}
