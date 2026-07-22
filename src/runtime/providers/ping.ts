import type { OidcProviderConfig } from '../server/utils/provider'
import { generateProviderUrl } from '../server/utils/config'
import { createProviderFetch, defineOidcProvider } from '../server/utils/provider'

type PingRequiredFields = 'baseUrl' | 'clientId' | 'clientSecret' | 'redirectUri'

export const ping = defineOidcProvider<OidcProviderConfig, PingRequiredFields>({
  authorizationUrl: '/as/authorization.oauth2',
  tokenUrl: '/as/token.oauth2',
  userInfoUrl: '/idp/userinfo.openid',
  logoutUrl: '/idp/startSLO.ping',
  logoutRedirectParameterName: 'post_logout_redirect_uri',
  tokenRequestType: 'form-urlencoded',
  pkce: true,
  state: true,
  nonce: true,
  requiredProperties: ['baseUrl', 'clientId', 'clientSecret', 'authorizationUrl', 'tokenUrl', 'redirectUri'],
  validateAccessToken: true,
  validateIdToken: true,
  async openIdConfiguration(config: OidcProviderConfig) {
    const configUrl = generateProviderUrl(config.baseUrl as string, '.well-known/openid-configuration')
    const customFetch = await createProviderFetch(config)
    return await customFetch(configUrl)
  },
})
