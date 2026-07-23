import { describe, expect, it } from 'vitest'
import { generateProviderUrl } from '../../../src/runtime/server/utils/config'
import { ping } from '../../../src/runtime/providers/ping'
import { keycloak } from '../../../src/runtime/providers/keycloak'

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
