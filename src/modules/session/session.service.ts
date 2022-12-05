import axios from 'axios';

import { size } from 'lodash';
import { SigninDto } from 'src/dto/session.dto';
import { UserService } from '../user/user.service';

import { KEYCLOAK, KEYCLOAK_APIS } from 'src/config/constants';
import { Injectable, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class SessionService {
  constructor(private userService: UserService) {}

  async login(signinAttrs: SigninDto) {
    try {
      const { email, password } = signinAttrs;
      const user = await this.userService.getUserNameByEmail(email);

      const bodyParams = new URLSearchParams({
        password,
        scope: KEYCLOAK.scope,
        username: user.username,
        client_id: KEYCLOAK.clientId,
        grant_type: KEYCLOAK.grantType,
        client_secret: KEYCLOAK.clientSecret,
      });
      const config = {
        method: 'POST',
        url: `${KEYCLOAK.baseUrl}/realms/myrealm/protocol/openid-connect/token`,
        headers: {
          'content-type': 'application/x-www-form-urlencoded',
        },
        data: bodyParams.toString(),
      };
      const response = await axios(config);
      console.log(response);
      return {
        data: user,
        accessToken: response.data.access_token,
        refreshToken: response.data.refresh_token,
      };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async logout(refreshToken: any) {
    if (!refreshToken)
      throw new UnauthorizedException(
        'You need to sign-in to access this page',
      );
    const bodyParams = new URLSearchParams({
      client_id: KEYCLOAK.clientId,
      client_secret: KEYCLOAK.clientSecret,
      refresh_token: refreshToken.split(' ')[size(refreshToken.split(' ')) - 1],
    });

    const config = {
      method: 'post',
      url: KEYCLOAK_APIS.logout,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      data: bodyParams.toString(),
    };
    await axios(config);
  }
}
