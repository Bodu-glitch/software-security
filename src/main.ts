import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import * as cookieParser from 'cookie-parser';
import * as process from 'node:process';
import { ValidationPipe } from '@nestjs/common';
import * as fs from 'node:fs';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

dotenv.config();

async function bootstrap() {
  const httpsOptions = {
    key: fs.readFileSync('./secrets/localhost-key.pem'),
    cert: fs.readFileSync('./secrets/localhost.pem'),
  };

  const app = await NestFactory.create(AppModule, {
    httpsOptions,
  });
  app.use(cookieParser(process.env.COOKIE_SECRET));
  app.useGlobalPipes(new ValidationPipe());

  const config = new DocumentBuilder()
    .setTitle('Software Security')
    .setDescription('Software Security')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  await app.listen(3000);
}

bootstrap();
