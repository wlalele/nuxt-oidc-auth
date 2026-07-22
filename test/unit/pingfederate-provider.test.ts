import { describe, it, expect } from 'vitest'
import { pingfederate } from '../../src/runtime/providers/pingfederate'

describe('PingFederate Provider', () => {
  it('should have correct default configuration', () => {
    expect(pingfederate).toBeDefined()
    expect(pingfederate.authorizationUrl).toBe('/as/authorization.oauth2')
    expect(pingfederate.tokenUrl).toBe('/as/token.oauth2')
    expect(pingfederate.userInfoUrl).toBe('/idp/userinfo.openid')
    expect(pingfederate.logoutUrl).toBe('/idp/startSLO.ping')
  })

  it('should have correct required properties', () => {
    expect(pingfederate.requiredProperties).toContain('baseUrl')
    expect(pingfederate.requiredProperties).toContain('clientId')
    expect(pingfederate.requiredProperties).toContain('clientSecret')
  })

  it('should have correct default settings', () => {
    expect(pingfederate.pkce).toBe(true)
    expect(pingfederate.state).toBe(true)
    expect(pingfederate.authenticationScheme).toBe('header')
    expect(pingfederate.tokenRequestType).toBe('form')
    expect(pingfederate.scope).toEqual(['openid', 'profile', 'email'])
  })

  it('should have correct validation settings', () => {
    expect(pingfederate.validateAccessToken).toBe(true)
    expect(pingfederate.validateIdToken).toBe(true)
  })
})