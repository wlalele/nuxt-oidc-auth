import { describe, expect, it } from 'vitest'
import { generateProviderUrl } from '../../../src/runtime/server/utils/config'
import { resolveProviderUrls } from '../../../src/runtime/server/utils/oidc'
import { ping } from '../../../src/runtime/providers/ping'
import { keycloak } from '../../../src/runtime/providers/keycloak'
import type { OidcProviderConfig } from '../../../src/runtime/server/utils/provider'

describe('Ping provider URL generation', () => {
  it('should generate authorization URL from baseUrl', () => {
    const baseUrl = 'https://sso.pingfederate.com'
    const url = generateProviderUrl(baseUrl, ping.authorizationUrl as string)
    expect(url).toBe('https://sso.pingfederate.com/as/authorization.oauth2')
  })

  it('should generate token URL from baseUrl', () => {
    const baseUrl = 'https://sso.pingfederate.com'
    const url = generateProviderUrl(baseUrl, ping.tokenUrl as string)
    expect(url).toBe('https://sso.pingfederate.com/as/token.oauth2')
  })

  it('should generate userInfo URL from baseUrl', () => {
    const baseUrl = 'https://sso.pingfederate.com'
    const url = generateProviderUrl(baseUrl, ping.userInfoUrl as string)
    expect(url).toBe('https://sso.pingfederate.com/idp/userinfo.openid')
  })

  it('should generate logout URL from baseUrl', () => {
    const baseUrl = 'https://sso.pingfederate.com'
    const url = generateProviderUrl(baseUrl, ping.logoutUrl as string)
    expect(url).toBe('https://sso.pingfederate.com/idp/startSLO.ping')
  })

  it('should handle baseUrl with trailing slash', () => {
    const baseUrl = 'https://sso.pingfederate.com/'
    const url = generateProviderUrl(baseUrl, ping.authorizationUrl as string)
    expect(url).toBe('https://sso.pingfederate.com/as/authorization.oauth2')
  })

  it('should handle baseUrl without protocol', () => {
    const baseUrl = 'sso.pingfederate.com'
    const url = generateProviderUrl(baseUrl, ping.authorizationUrl as string)
    expect(url).toBe('https://sso.pingfederate.com/as/authorization.oauth2')
  })

  it('should have pkce enabled by default', () => {
    expect(ping.pkce).toBe(true)
  })

  it('should have state enabled by default', () => {
    expect(ping.state).toBe(true)
  })

  it('should have nonce enabled by default', () => {
    expect(ping.nonce).toBe(true)
  })

  it('should require baseUrl, clientId, clientSecret and redirectUri', () => {
    expect(ping.requiredProperties).toContain('baseUrl')
    expect(ping.requiredProperties).toContain('clientId')
    expect(ping.requiredProperties).toContain('clientSecret')
    expect(ping.requiredProperties).toContain('authorizationUrl')
    expect(ping.requiredProperties).toContain('tokenUrl')
    expect(ping.requiredProperties).toContain('redirectUri')
  })
})

describe('Existing providers still work', () => {
  it('should generate correct Keycloak authorization URL', () => {
    const baseUrl = 'http://localhost:8080/realms/nuxt-oidc-test'
    const url = generateProviderUrl(baseUrl, keycloak.authorizationUrl as string)
    expect(url).toBe('http://localhost:8080/realms/nuxt-oidc-test/protocol/openid-connect/auth')
  })

  it('should generate correct Keycloak token URL', () => {
    const baseUrl = 'http://localhost:8080/realms/nuxt-oidc-test'
    const url = generateProviderUrl(baseUrl, keycloak.tokenUrl as string)
    expect(url).toBe('http://localhost:8080/realms/nuxt-oidc-test/protocol/openid-connect/token')
  })

  it('should generate correct Keycloak userinfo URL', () => {
    const baseUrl = 'http://localhost:8080/realms/nuxt-oidc-test'
    const url = generateProviderUrl(baseUrl, keycloak.userInfoUrl as string)
    expect(url).toBe('http://localhost:8080/realms/nuxt-oidc-test/protocol/openid-connect/userinfo')
  })

  it('should generate correct Keycloak logout URL', () => {
    const baseUrl = 'http://localhost:8080/realms/nuxt-oidc-test'
    const url = generateProviderUrl(baseUrl, keycloak.logoutUrl as string)
    expect(url).toBe('http://localhost:8080/realms/nuxt-oidc-test/protocol/openid-connect/logout')
  })
})

describe('resolveProviderUrls runtime resolution', () => {
  it('should resolve relative URLs when baseUrl is set', () => {
    const config = resolveProviderUrls({
      baseUrl: 'https://sso.pingfederate.com',
      authorizationUrl: '/as/authorization.oauth2',
      tokenUrl: '/as/token.oauth2',
      userInfoUrl: '/idp/userinfo.openid',
      logoutUrl: '/idp/startSLO.ping',
    } as OidcProviderConfig)

    expect(config.authorizationUrl).toBe('https://sso.pingfederate.com/as/authorization.oauth2')
    expect(config.tokenUrl).toBe('https://sso.pingfederate.com/as/token.oauth2')
    expect(config.userInfoUrl).toBe('https://sso.pingfederate.com/idp/userinfo.openid')
    expect(config.logoutUrl).toBe('https://sso.pingfederate.com/idp/startSLO.ping')
  })

  it('should preserve absolute URLs when baseUrl is set', () => {
    const config = resolveProviderUrls({
      baseUrl: 'https://sso.pingfederate.com',
      authorizationUrl: 'https://custom.example.com/authorize',
      tokenUrl: 'https://custom.example.com/token',
    } as OidcProviderConfig)

    expect(config.authorizationUrl).toBe('https://custom.example.com/authorize')
    expect(config.tokenUrl).toBe('https://custom.example.com/token')
  })

  it('should not modify config when baseUrl is not set', () => {
    const config = resolveProviderUrls({
      authorizationUrl: 'https://github.com/login/oauth/authorize',
      tokenUrl: 'https://github.com/login/oauth/access_token',
    } as OidcProviderConfig)

    expect(config.authorizationUrl).toBe('https://github.com/login/oauth/authorize')
    expect(config.tokenUrl).toBe('https://github.com/login/oauth/access_token')
  })

  it('should resolve placeholders in baseUrl', () => {
    const config = resolveProviderUrls({
      baseUrl: 'https://login.microsoftonline.com/{tenantId}',
      tenantId: 'my-tenant',
      authorizationUrl: '/oauth2/v2.0/authorize',
      tokenUrl: '/oauth2/v2.0/token',
    } as unknown as OidcProviderConfig)

    expect(config.authorizationUrl).toBe('https://login.microsoftonline.com/my-tenant/oauth2/v2.0/authorize')
    expect(config.tokenUrl).toBe('https://login.microsoftonline.com/my-tenant/oauth2/v2.0/token')
  })

  it('should work with Keycloak-style relative paths', () => {
    const config = resolveProviderUrls({
      baseUrl: 'http://localhost:8080/realms/nuxt-oidc-test',
      authorizationUrl: 'protocol/openid-connect/auth',
      tokenUrl: 'protocol/openid-connect/token',
      userInfoUrl: 'protocol/openid-connect/userinfo',
      logoutUrl: 'protocol/openid-connect/logout',
    } as OidcProviderConfig)

    expect(config.authorizationUrl).toBe('http://localhost:8080/realms/nuxt-oidc-test/protocol/openid-connect/auth')
    expect(config.tokenUrl).toBe('http://localhost:8080/realms/nuxt-oidc-test/protocol/openid-connect/token')
    expect(config.userInfoUrl).toBe('http://localhost:8080/realms/nuxt-oidc-test/protocol/openid-connect/userinfo')
    expect(config.logoutUrl).toBe('http://localhost:8080/realms/nuxt-oidc-test/protocol/openid-connect/logout')
  })
})
