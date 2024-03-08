import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';

import { AppModule } from './app.module';
import { AppConfig } from './config';
import { createSwaggerDocument } from './swagger';
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
