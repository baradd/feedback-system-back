import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AppConfigModule } from './config/app/app-config.module';
import { DatabaseConfigModule } from './config/database/database-config.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseConfigService } from './config/database/database-config.service';
import { DatabaseModule } from './config/database/database.module';
import { UserModule } from './modules/user/user.module';
import { CustomCacheModule } from './common/cache/cache.module';

@Module({
  imports: [AppConfigModule, DatabaseModule, UserModule, CustomCacheModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
