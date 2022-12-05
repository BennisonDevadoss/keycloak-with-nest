import { PasswordService } from './password.service';

import { FastifyRequest, FastifyReply } from 'fastify';
import { ChangePasswordDto, ResetPasswordDto } from 'src/dto/password.dto';

import { Body, Controller, Post, Put, Req, Res } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('password')
@Controller('password')
export class PasswordController {
  constructor(private passwordService: PasswordService) {}

  @Put('change_password')
  async changePassword(
    @Req() req: any,
    @Res() reply: FastifyReply,
    @Body() params: ChangePasswordDto,
  ) {
    try {
      const currentUser = req.raw.user;
      console.log(currentUser);
      await this.passwordService.changePassword(params, currentUser);
      reply.send({ message: 'Password has been changed successfully' });
    } catch (error) {
      reply.send(error);
    }
  }

  @Post('send_reset_password_link')
  async sendResetPasswordLink(
    @Req() req: FastifyRequest,
    @Body() params: ResetPasswordDto,
    @Res() reply: FastifyReply,
  ) {
    const token = req.headers.authorization || '';
    const { email } = params;
    await this.passwordService.sendResetPasswordInstruction(token, email);
  }
}
