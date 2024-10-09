import { NestFactory } from '@nestjs/core';
import cookieParser from 'cookie-parser';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './filters/exception.filter';
import { ConfigService } from '@nestjs/config';

async function initServer() {
  const configService = new ConfigService();
  const app = await NestFactory.create(AppModule);
  app.enableCors({ credentials: true, origin: configService.get<string>('REQUEST_ORIGIN') });
  app.use(cookieParser());
  app.useGlobalFilters(new HttpExceptionFilter());

  await app.listen(3000);
}

initServer();
