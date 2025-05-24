import { ConfigService } from '@nestjs/config';

export class RedisConfigService {
  constructor(private readonly configService: ConfigService) {}

  get host(): string {
    return this.configService.get<string>('redis.host') || 'localhost';
  }

  get port(): number {
    return this.configService.get<number>('redis.port') || 6379;
  }

  get password(): string {
    return this.configService.get<string>('redis.password') || '';
  }

  get db(): number {
    return parseInt(this.configService.get<string>('redis.db'), 10) || 0;
  }

  get ttl(): number {
    return this.configService.get<number>('redis.ttl') || 3600;
  }
}
