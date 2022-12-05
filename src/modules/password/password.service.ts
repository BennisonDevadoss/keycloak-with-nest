import axios from 'axios';

import { KEYCLOAK } from 'src/config/constants';
import { UserInstance } from 'src/dto/users.dto';
import { ChangePasswordDto } from 'src/dto/password.dto';

import { Injectable, UnprocessableEntityException } from '@nestjs/common';

@Injectable()
export class PasswordService {
  async changePassword(
    changePasswordAttrs: ChangePasswordDto,
    currentUser: UserInstance,
  ) {
    try {
      const { password, confirm_new_password } = changePasswordAttrs;
      const { user_id: userId } = currentUser;

      if (password !== confirm_new_password)
        throw new UnprocessableEntityException(
          "confirm password doesn't match password",
        );

      const data = JSON.stringify({
        type: 'password',
        temporary: false,
        value: password,
      });

      const config = {
        method: 'PUT',
        url: `${KEYCLOAK.baseUrl}/admin/realms/${KEYCLOAK.realm}/users/${userId}/reset-password`,
        headers: {
          'Content-Type': 'application/json',
          Authorization: currentUser.access_token,
        },
        data,
      };
      await axios(config);
    } catch (error) {
      throw error;
    }
  }

  /* NOTE: NOT YET IMPLEMENTED */
  async sendResetPasswordInstruction(token: string, email: string) {
    const data = JSON.stringify(['UPDATE_PASSWORD']);
    const config = {
      method: 'PUT',
      url: `${KEYCLOAK.baseUrl}/admin/realms/${KEYCLOAK.realm}/users/7bec7582-dd0f-499b-9e83-a51cadd3cbc8/execute-actions-email`,
      headers: {
        Authorization: 'Bearer ',
        'Content-Type': 'application/json',
      },
      data,
    };

    await axios(config);
  }
}
