import { Module } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from 'src/config/database';
import { SessionService } from './session.service';
import { SessionController } from './session.controller';

@Module({
  controllers: [SessionController],
  providers: [SessionService, PrismaService, ConfigService, UserService],
})
export class SessionModule {}
