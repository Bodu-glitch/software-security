import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import * as cookieParser from 'cookie-parser';
import * as process from 'node:process';
import { ValidationPipe } from '@nestjs/common';
import * as fs from 'node:fs';

dotenv.config();

async function bootstrap() {
  const httpsOptions = {
    key: fs.readFileSync('./secrets/private-key.pem'),
    cert: fs.readFileSync('./secrets/public-certificate.pem'),
  };

  const app = await NestFactory.create(AppModule, {
    httpsOptions,
  });
  app.use(cookieParser(process.env.COOKIE_SECRET));
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(3000);
}

bootstrap();
