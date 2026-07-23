import type { OidcProviderConfig } from '../server/utils/provider'
import { defineOidcProvider } from '../server/utils/provider'

export interface PingFederateProviderConfig extends OidcProviderConfig {
  baseUrl?: string
}

export const pingfederate = defineOidcProvider<
  PingFederateProviderConfig,
  'baseUrl' | 'clientId' | 'clientSecret' | 'authorizationUrl' | 'tokenUrl'
>({
  authorizationUrl: '/as/authorization.oauth2',
  tokenUrl: '/as/token.oauth2',
  userInfoUrl: '/idp/userinfo.openid',
  logoutUrl: '/idp/startSLO.ping',
  scope: ['openid', 'profile', 'email'],
})
