import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import 'dotenv/config';
import { LoggerFactory } from './logger/logger.factory';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });

  const loggerType = process.env.LOGGER_TYPE || 'dev';
  const logger = LoggerFactory.create(loggerType);

  app.setGlobalPrefix('api/afisha');
  app.enableCors();
  app.useLogger(logger);

  await app.listen(3000);
}
bootstrap();
