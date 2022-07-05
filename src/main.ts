import * as cors from 'cors';
import { NestFactory } from '@nestjs/core';
import helmet from 'helmet';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const options: cors.CorsOptions = {
    methods: 'GET,POST',
    origin: '*'
  };

  app.use(cors(options));
  app.use(helmet());

  await app.listen(3000);
}
bootstrap();
