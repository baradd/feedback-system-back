import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AppConfigModule } from './config/app/app-config.module';
import { DatabaseConfigModule } from './config/database/database-config.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseConfigService } from './config/database/database-config.service';

@Module({
  imports: [AppConfigModule, TypeOrmModule.forRootAsync({
    imports: [DatabaseConfigModule],
    inject: [DatabaseConfigService],
    useFactory: (dbConfig: DatabaseConfigService) => ({
      type: dbConfig.type as any,
      host: dbConfig.host,
      port: dbConfig.port,
      username: dbConfig.username,
      password: dbConfig.password,

    })
  })],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
