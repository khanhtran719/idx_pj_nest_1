import { ValidationError, ValidationPipe } from '@nestjs/common';
import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';

import { AppModule } from './app.module';
import { AppConfig } from './config';
import { createSwaggerDocument } from './swagger';
import { TypeORMExceptionFilter } from './system/dbs';
import { ValidationException } from './system/exceptions';
import { AllExceptionFilter } from './system/filters';
import { Logger } from './system/log';
import { isProduction } from './utils';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    bufferLogs: true,
    logger: isProduction()
      ? ['log', 'error']
      : ['log', 'error', 'warn', 'debug', 'verbose'],
  });

  //#region INJECT CONFIG
  const _app_config = app.get(AppConfig);
  const _logger = app.get(Logger);
  const _http = app.get(HttpAdapterHost);
  //#endregion

  //#region CONFIG
  app.enableCors({
    origin: '*',
    credentials: true,
  });

  app.use(cookieParser());

  app.setGlobalPrefix('api');

  app.useLogger(_logger);

  app.use(
    helmet({
      xssFilter: true,
      hidePoweredBy: true,
    }),
  );

  app.useBodyParser('json', { limit: '50mb' });
  app.useBodyParser('urlencoded', { extended: true, limit: '50mb' });

  app.useGlobalFilters(
    new TypeORMExceptionFilter(_http),
    new AllExceptionFilter(_http),
  );

  app.useGlobalPipes(
    new ValidationPipe({
      // stopAtFirstError: true,
      whitelist: true,
      transform: true,
      exceptionFactory: (errors: ValidationError[]) =>
        new ValidationException(null, errors),
    }),
  );
  //#endregion

  //#region SWAGGER
  if (_app_config.getApiDocument()) {
    createSwaggerDocument(app);
  }
  //#endregion

  const port = _app_config.getPort();
  const host = _app_config.getHost();

  await app.listen(port, host, () => {
    _logger.log(`Application listen in ${port}`, 'Application');
  });
}

bootstrap();
