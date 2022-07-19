import * as cors from 'cors';
import { NestFactory } from '@nestjs/core';
import helmet from 'helmet';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const urls: string[] = process.env.CORS_ENABLED_URL.split('|');

  const options: cors.CorsOptions = {
    methods: 'GET,POST',
    origin: '*',
  };

  app.enableCors({
    methods: ['GET', 'POST'],
    origin: urls,
  });
  app.use(helmet());

  await app.listen(process.env.PORT || 3000);
}
bootstrap();
