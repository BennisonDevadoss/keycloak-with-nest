import axios from 'axios';

import { UserService } from 'src/modules/user/user.service';
import { UserInstance } from 'src/dto/users.dto';
import { KEYCLOAK_APIS } from 'src/config/constants';
import { FastifyRequest } from 'fastify';

import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';

declare module 'fastify' {
  interface FastifyRequest {
    user: UserInstance;
  }
}

@Injectable()
export class UserAuthMiddleware implements NestMiddleware {
  constructor(private userService: UserService) {}
  use(req: FastifyRequest, reply: any, next: (error?: any) => void) {
    const token = req.headers?.['authorization'];
    if (!token)
      return next({ errors: 'You need to sign-in to access this page' });
    const config = {
      method: 'GET',
      url: KEYCLOAK_APIS.validateToken,
      headers: {
        Authorization: token,
      },
    };
    return axios(config)
      .then(async (user) => {
        // console.log(user);
        const currentUser = await this.userService.getUserByUserName(
          user.data.preferred_username,
        );
        req.user = {
          ...currentUser,
          access_token: token,
          user_id: user.data.sub,
        };
        // console.log(req.user);
        next();
      })
      .catch((error) => {
        next({ errors: ['Session has expired'] });
      });
  }
}
