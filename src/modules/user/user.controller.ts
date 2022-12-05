import { UserService } from './user.service';
import { FastifyReply } from 'fastify';
import { UserCreateDto } from 'src/dto/users.dto';

import { Res, Req, Body, Post, Controller, HttpStatus } from '@nestjs/common';

@Controller()
export class UserController {
  constructor(private userService: UserService) {}
  @Post('users')
  async create(
    @Req() req: any,
    @Res() reply: FastifyReply,
    @Body() params: UserCreateDto,
  ) {
    try {
      const currentUser = req.raw.user;

      const user = await this.userService.create(params, currentUser);
      reply.code(HttpStatus.CREATED).send(user);
    } catch (error) {
      reply.send(error);
    }
  }
}
