import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './controllers/app.controller';
import { AppService } from './services/app.service';
import { OnchainService } from './services/onchain.service';
import { BoxService } from './services/box.service';
import { AuthMiddleware } from './middlewares/auth.middleware';
import { AESCrypt } from './utils/crypt/aes-crypt';
import { HashBoxService } from './services/hashbox.service';
import di from './di';

@Module({
  imports: [
    ConfigModule.forRoot({
      cache: true,
    }),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    OnchainService,
    BoxService,
    HashBoxService,
    { provide: di.AESCrypt, useClass: AESCrypt },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes(AppController);
  }
}
