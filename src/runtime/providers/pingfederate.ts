import type { OidcProviderConfig } from '../server/utils/provider'
import { defineOidcProvider } from '../server/utils/provider'

type PingFederateRequiredFields = 'baseUrl' | 'clientId' | 'clientSecret'

export const pingfederate = defineOidcProvider<OidcProviderConfig, PingFederateRequiredFields>({
  authorizationUrl: '/as/authorization.oauth2',
  tokenUrl: '/as/token.oauth2',
  userInfoUrl: '/idp/userinfo.openid',
  logoutUrl: '/idp/startSLO.ping',
  pkce: true,
  state: true,
  nonce: false,
  authenticationScheme: 'header',
  tokenRequestType: 'form',
  scope: ['openid', 'profile', 'email'],
  requiredProperties: ['baseUrl', 'clientId', 'clientSecret', 'authorizationUrl', 'tokenUrl'],
  validateAccessToken: true,
  validateIdToken: true,
})