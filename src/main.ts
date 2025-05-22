import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AppConfigService } from './config/app/app-config.service';
import { setupSwagger } from './config/swagger/swagger.config';

async function bootstrap(
) {
  const app = await NestFactory.create(AppModule);
  setupSwagger(app)

  await app.listen(process.env.PORT);

}
bootstrap();
