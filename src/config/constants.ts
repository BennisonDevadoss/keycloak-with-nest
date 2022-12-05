export const MODELS = ['User'];
export const REALM = 'myrealm';

export const KEYCLOAK = {
  realm: 'myrealm',
  scope: 'openid',
  baseUrl: 'http://bennison.local:82',
  clientId: 'test',
  grantType: 'password',
  clientSecret: '6aLIM2i8sbPUDxtVnBfqNFbGxYd19p1A',
};

export const KEYCLOAK_APIS = {
  logout: `${KEYCLOAK.baseUrl}/realms/${KEYCLOAK.realm}/protocol/openid-connect/logout`,
  users: `${KEYCLOAK.baseUrl}/admin/realms/${KEYCLOAK.realm}/users`,
  createUser: `${KEYCLOAK.baseUrl}/admin/realms/${KEYCLOAK.realm}/users`,
  validateToken: `${KEYCLOAK.baseUrl}/realms/${KEYCLOAK.realm}/protocol/openid-connect/userinfo`,
};

/* RESET PASSWORD: http://localhost:8080/admin/realms/myrealm/users/{USER-ID}/reset-password */
