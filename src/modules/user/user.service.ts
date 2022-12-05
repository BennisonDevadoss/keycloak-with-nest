import axios from 'axios';
import * as moment from 'moment';

import { size } from 'lodash';
import { PrismaService } from 'src/config/database';
import { KEYCLOAK_APIS } from 'src/config/constants';

import { UserCreateDto, UserInstance } from 'src/dto/users.dto';

import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  private async getUserById(userId: number) {
    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
    });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async getUserNameByEmail(email: string) {
    const user = await this.prisma.user.findFirst({
      where: {
        email,
      },
    });
    if (!user) {
      throw new UnauthorizedException('Invalid Email or Password');
    }
    return user;
  }

  async getUserByUserName(username: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        username,
      },
    });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  private async getUserDetailFromKeyCloak(userName: string, accessToken: any) {
    try {
      const config = {
        method: 'GET',
        url: `${KEYCLOAK_APIS.users}?username=${userName}`,
        headers: {
          Authorization: accessToken,
        },
      };
      const response = await axios(config);
      const createdUser = response.data;
      if (!size(createdUser)) throw new NotFoundException('User not found');
      return createdUser;
    } catch (error) {
      throw error;
    }
  }

  private async sendInvitationEmailToUser(userId: string, accessToken: any) {
    try {
      const data = JSON.stringify(['UPDATE_PASSWORD']);
      const config = {
        method: 'PUT',
        url: `${KEYCLOAK_APIS.users}/${userId}/execute-actions-email`,
        headers: {
          'Content-Type': 'application/json',
          Authorization: accessToken,
        },
        data,
      };
      await axios(config);
    } catch (error) {
      throw error;
    }
  }

  async create(attrs: UserCreateDto, currentUser: UserInstance) {
    try {
      /* create user in the keycloak */
      const { access_token: accessToken } = currentUser;
      const userName = moment().format('Y-MM-DD HH:mm:ss');
      const currentTime = new Date();
      const userCreateAttrs = {
        email: attrs.email,
        enabled: true,
        username: userName,
        lastName: attrs.last_name,
        firstName: attrs.first_name,
      };
      const config = {
        method: 'post',
        url: KEYCLOAK_APIS.createUser,
        headers: {
          Authorization: currentUser.access_token,
          'Content-Type': 'application/json',
        },
        data: JSON.stringify(userCreateAttrs),
      };
      await axios(config);

      /* get created user details from keycloak */
      const user = await this.prisma.user.create({
        data: {
          email: attrs.email,
          username: userName,
          last_name: attrs.last_name,
          created_at: currentTime,
          updated_at: currentTime,
          first_name: attrs.first_name,
        },
      });
      const createdUser = await this.getUserDetailFromKeyCloak(
        userName,
        accessToken,
      );
      console.log('createdUser', createdUser);

      /* send invitation link to created user */
      await this.sendInvitationEmailToUser(createdUser[0].id, accessToken);
      return user;
    } catch (error) {
      throw error;
    }
  }

  async update(userId: number, attrs: any, currentUser: UserInstance) {
    const user = await this.getUserById(userId);
    const { username } = user;
    const { access_token: accessToken } = currentUser;

    const keycloakUserData = await this.getUserDetailFromKeyCloak(
      username,
      accessToken,
    );

    const keycloakUserUpdateData = {
      lastName: attrs.last_name,
      firstName: attrs.first_name,
    };
    const config = {
      method: 'PUT',
      url: `${KEYCLOAK_APIS.users}/${keycloakUserData[0].id}`,
      headers: {
        Authorization: currentUser.access_token,
        'Content-Type': 'application/json',
      },
      data: JSON.stringify(keycloakUserUpdateData),
    };
    await axios(config);
    return await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: attrs,
    });
  }

  async destroy(userId: number, currentUser: UserInstance) {
    const user = await this.getUserById(userId);
    const { username } = user;
    const { access_token: accessToken } = currentUser;

    const keycloakUserData = await this.getUserDetailFromKeyCloak(
      username,
      accessToken,
    );
    const config = {
      method: 'DELETE',
      url: `${KEYCLOAK_APIS.users}/${keycloakUserData[0].id}`,
      headers: {
        Authorization: currentUser.access_token,
        'Content-Type': 'application/json',
      },
      data: JSON.stringify({}),
    };
    await axios(config);
    await this.prisma.user.delete({ where: { id: userId } });
  }
}
