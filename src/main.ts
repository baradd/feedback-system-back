import { NestApplication, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AppConfigService } from './config/app/app-config.service';
import { setupSwagger } from './config/swagger/swagger.config';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ValidationPipe } from '@nestjs/common';
import { OtherExceptionsFilter } from './common/filters/other-exception.filter';
import { MariaExceptionFilter } from './common/filters/maria-exception.filter';
import { UnauthorizedExceptionFilter } from './common/filters/unauthorized-exception.filter';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.useBodyParser('json', { limit: '100mb' });
  app.useBodyParser('urlencoded', { limit: '100mb', extended: true });

  app.useGlobalFilters(
    new MariaExceptionFilter(), // Handle specific database errors first
    new UnauthorizedExceptionFilter(), // Then handle authentication-specific errors
    new HttpExceptionFilter(), // Then handle general HTTP errors
    new OtherExceptionsFilter(), // Catch all unhandled errors last
  );

  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));

  setupSwagger(app);

  await app.listen(+process.env.PORT);
}
bootstrap();
