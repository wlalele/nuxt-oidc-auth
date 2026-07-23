import { describe, expect, it } from 'vitest'
import { pingfederate } from '../../runtime/providers/pingfederate'
import { generateProviderUrl } from '../../runtime/server/utils/config'

describe('pingfederate provider', () => {
  const baseUrl = 'https://pingfederate.example.com'
  const authUrl = '/as/authorization.oauth2'
  const tokenUrl = '/as/token.oauth2'
  const userInfoUrl = '/idp/userinfo.openid'
  const logoutUrl = '/idp/startSLO.ping'

  it('should have correct default values', () => {
    expect(pingfederate.authorizationUrl).toBe(authUrl)
    expect(pingfederate.tokenUrl).toBe(tokenUrl)
    expect(pingfederate.userInfoUrl).toBe(userInfoUrl)
    expect(pingfederate.logoutUrl).toBe(logoutUrl)
    expect(pingfederate.scope).toEqual(['openid', 'profile', 'email'])
  })

  it('should have correct required properties', () => {
    expect(pingfederate.requiredProperties).toContain('baseUrl')
    expect(pingfederate.requiredProperties).toContain('clientId')
    expect(pingfederate.requiredProperties).toContain('clientSecret')
    expect(pingfederate.requiredProperties).toContain('authorizationUrl')
    expect(pingfederate.requiredProperties).toContain('tokenUrl')
  })

  it('should generate correct URLs when baseUrl is provided', () => {
    // This test mimics the logic in src/module.ts
    const providerConfig = {
      ...pingfederate,
      baseUrl: baseUrl,
    }

    const expectedAuthUrl = 'https://pingfederate.example.com/as/authorization.oauth2'
    const expectedTokenUrl = 'https://pingfederate.example.com/as/token.oauth2'
    const expectedUserInfoUrl = 'https://pingfederate.example.com/idp/userinfo.openid'
    const expectedLogoutUrl = 'https://pingfederate.example.com/idp/startSLO.ping'

    expect(generateProviderUrl(providerConfig.baseUrl, pingfederate.authorizationUrl)).toBe(expectedAuthUrl)
    expect(generateProviderUrl(providerConfig.baseUrl, pingfederate.tokenUrl)).toBe(expectedTokenUrl)
    expect(generateProviderUrl(providerConfig.baseUrl, pingfederate.userInfoUrl)).toBe(expectedUserInfoUrl)
    expect(generateProviderUrl(providerConfig.baseUrl, pingfederate.logoutUrl)).toBe(expectedLogoutUrl)
  })

  it('should not break existing providers (oidc)', () => {
    const { oidc } = require('../../runtime/providers')
    expect(oidc.authorizationUrl).toBeDefined()
    expect(oidc.tokenUrl).toBeDefined()
  })
})
