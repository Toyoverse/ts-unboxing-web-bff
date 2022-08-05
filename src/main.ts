import * as cors from 'cors';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import helmet from 'helmet';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const options: cors.CorsOptions = {
    methods: 'GET,POST',
    origin: '*'
  };

  app.use(cors(options));
  app.use(helmet());

  const config = new DocumentBuilder()
    .setTitle('Toyoverse Unboxing BFF')
    .setDescription('The Toyoverse Unboxing API description')
    .setVersion('1.0.3')
    .addTag('unboxing')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  await app.listen(process.env.PORT || 3000);
}
bootstrap();
