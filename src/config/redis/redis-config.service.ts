import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class RedisConfigService {
  constructor(private readonly configService: ConfigService) { }

  get host(): string {
    return this.configService.get<string>('REDIS_HOST');
  }

  get port(): number {
    return this.configService.get<number>('REDIS_PORT') || 6379;
  }

  get password(): string {
    return this.configService.get<string>('REDIS_PORT') || '';
  }

  get db(): number {
    return parseInt(this.configService.get<string>('REDIS_DB'), 10) || 0;
  }

  get ttl(): number {
    return this.configService.get<number>('REDIS_TTL') || 3600;
  }
}
