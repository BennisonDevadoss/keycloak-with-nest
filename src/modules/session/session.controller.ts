import { ApiTags } from '@nestjs/swagger';
import { SigninDto } from 'src/dto/session.dto';
import { SessionService } from './session.service';

import { FastifyRequest, FastifyReply } from 'fastify';

import {
  Res,
  Req,
  Body,
  Post,
  Delete,
  Controller,
  HttpStatus,
} from '@nestjs/common';

@ApiTags('session')
@Controller()
export class SessionController {
  constructor(private sessionService: SessionService) {}

  @Post('login')
  async login(@Body() params: SigninDto, @Res() reply: FastifyReply) {
    try {
      const user = await this.sessionService.login(params);
      reply.header('Authorization', `Bearer ${user.accessToken}`);
      reply.header('refresh_token', `Bearer ${user.refreshToken}`);
      reply.code(HttpStatus.OK).send(user.data);
    } catch (error) {
      reply.send(error);
    }
  }

  @Delete('logout')
  async logout(@Req() req: FastifyRequest, @Res() reply: FastifyReply) {
    try {
      const refreshToken = req.headers.refresh_token;
      await this.sessionService.logout(refreshToken);
      reply.code(HttpStatus.OK).send({ message: 'Successfully logged-out' });
    } catch (error) {
      reply.send(error);
    }
  }
}
