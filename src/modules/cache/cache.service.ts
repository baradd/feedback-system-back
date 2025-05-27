import { Injectable } from '@nestjs/common';
import { CacheRepository } from './cache.repository';

@Injectable()
export class CacheService {
  constructor(private readonly cacheRepository: CacheRepository) {}

  async get(prefix: string, key: string): Promise<string | null> {
    return await this.cacheRepository.get(prefix, key);
  }

  async set(prefix: string, key: string, value: any): Promise<void> {
    await this.cacheRepository.set(prefix, key, value);
  }

  async delete(prefix: string, key: string): Promise<void> {
    await this.cacheRepository.delete(prefix, key);
  }

  async setWithExpiry(
    prefix: string,
    key: string,
    value: any,
    expiry: number,
  ): Promise<void> {
    await this.cacheRepository.setWithExpiry(prefix, key, value, expiry);
  }

  async exists(prefix: string, key: string): Promise<boolean> {
    const result = await this.cacheRepository.get(prefix, key);
    return result !== null;
  }

  async getTtl(prefix: string, key: string): Promise<number> {
    return await this.cacheRepository.getTtl(prefix, key);
  }

  async sadd(prefix: string, key: string, value: any): Promise<number> {
    return await this.cacheRepository.sadd(prefix, key, value);
  }

  async smembers(prefix: string, key: string): Promise<string[]> {
    return await this.cacheRepository.smembers(prefix, key);
  }

  async srem(prefix: string, key: string, value: any): Promise<number> {
    return await this.cacheRepository.srem(prefix, key, value);
  }
}
