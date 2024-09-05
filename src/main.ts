import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import cookieParser from 'cookie-parser';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './filters/exception.filter';

async function initServer() {
  const configService = new ConfigService();
  const app = await NestFactory.create(AppModule);
  app.enableCors({ origin: configService.get<string>('REQUEST_ORIGIN') });
  app.useGlobalFilters(new HttpExceptionFilter());
  app.use(cookieParser());

  await app.listen(3000);
}

initServer();
