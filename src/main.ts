import logger from './config/logger';

import { AppModule } from './app.module';
import { SwaggerModule } from '@nestjs/swagger';
import { swaggerOption } from './config/swagger-options';
import { ValidationPipe } from '@nestjs/common';
import { HttpExceptionFilter } from './exceptions/http-exception.filter';

import { HttpAdapterHost, NestFactory } from '@nestjs/core';

import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';

async function bootstrap() {
  const PORT = process.env.PORT || 3005;
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({ logger }),
  );
  app.setGlobalPrefix('v1');
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

  const { httpAdapter } = app.get(HttpAdapterHost);
  app.useGlobalFilters(new HttpExceptionFilter(httpAdapter));

  const document = SwaggerModule.createDocument(app, swaggerOption);
  SwaggerModule.setup('doc', app, document);

  await app.listen(PORT, '0.0.0.0');
}
bootstrap();
