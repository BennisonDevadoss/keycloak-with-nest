import { AppService } from './app.service';
import { UserModule } from './modules/user/user.module';
import { UserService } from './modules/user/user.service';
import { ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { PrismaService } from './config/database';
import { SessionModule } from './modules/session/session.module';
import { PasswordModule } from './modules/password/password.module';
import { UserAuthMiddleware } from './strategy/user.authentication.strategy';

import {
  Module,
  NestModule,
  RequestMethod,
  MiddlewareConsumer,
} from '@nestjs/common';

@Module({
  imports: [SessionModule, UserModule, PasswordModule],
  providers: [AppService, UserService, PrismaService, ConfigService],
  controllers: [AppController],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(UserAuthMiddleware)
      .forRoutes(
        { path: 'users', method: RequestMethod.POST },
        { path: 'logout', method: RequestMethod.DELETE },
        { path: 'users/*', method: RequestMethod.ALL },
        { path: 'password/*', method: RequestMethod.PUT },
      );
  }
}
