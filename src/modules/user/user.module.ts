import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { PrismaService } from 'src/config/database';
import { ConfigService } from '@nestjs/config';
import { UserController } from './user.controller';

@Module({
  providers: [UserService, PrismaService, ConfigService],
  controllers: [UserController],
})
export class UserModule {}
