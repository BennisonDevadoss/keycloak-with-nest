import { UserService } from './user.service';

import { FastifyRequest, FastifyReply } from 'fastify';
import { UserCreateDto, UserUpdateDto } from 'src/dto/users.dto';

import {
  Put,
  Res,
  Req,
  Body,
  Post,
  Param,
  Delete,
  Controller,
  HttpStatus,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('user')
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

  @Put('users/:id')
  async update(
    @Res() reply: FastifyReply,
    @Req() req: FastifyRequest | any,
    @Body() params: UserUpdateDto,
    @Param('id', new ParseIntPipe()) userId: number,
  ) {
    try {
      const currentUser = req.raw.user;
      const user = await this.userService.update(userId, params, currentUser);
      reply.code(HttpStatus.OK).send(user);
    } catch (error) {
      reply.send(error);
    }
  }

  @Delete('users/:id')
  async destroy(
    @Res() reply: FastifyReply,
    @Req() req: FastifyRequest | any,
    @Param('id', new ParseIntPipe()) userId: number,
  ) {
    try {
      const currentUser = req.raw.user;
      await this.userService.destroy(userId, currentUser);
      reply
        .code(HttpStatus.OK)
        .send({ message: 'User was deleted successfully' });
    } catch (error) {
      reply.send(error);
    }
  }
}
