import { Module } from '@nestjs/common';
import { RedisConfigService } from './redis-config.service';
import { ConfigModule } from '@nestjs/config';
import configuration from './configuration';

@Module({
  imports: [ConfigModule.forRoot({ load: [configuration] })],
  providers: [RedisConfigService],
  exports: [RedisConfigService],
})
export class RedisConfigModule {}
