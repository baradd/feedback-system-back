import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import {
    SWAGGER_API_DESCRIPTION,
    SWAGGER_API_NAME,
    SWAGGER_API_ROOT,
    SWAGGER_API_VERSION,
} from './configuration';
import fs, { readFileSync } from 'fs'
import { join } from 'path';

export function setupSwagger(app: INestApplication) {
    const config = new DocumentBuilder()
        .setTitle(SWAGGER_API_NAME)
        .setDescription(SWAGGER_API_DESCRIPTION)
        .setVersion(SWAGGER_API_VERSION)
        .addBearerAuth(
            {
                type: 'http',
                name: 'JWT token',
                scheme: 'bearer',
                description: 'JWT token for authentication',
                bearerFormat: 'JWT',
                in: 'header',
            },
            'token',
        ).addApiKey({
            type: 'apiKey',
            name: 'x-api-key',
            in: 'header',
            description: 'API key for authentication',
        },
            'x-api-key',).build()

    const document = SwaggerModule.createDocument(app, config)

    SwaggerModule.setup(SWAGGER_API_ROOT, app, document)
}
