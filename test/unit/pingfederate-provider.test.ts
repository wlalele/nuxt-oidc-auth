import { describe, expect, it } from 'vitest'
import { pingfederate } from '../../runtime/providers/pingfederate'

describe('pingfederate provider', () => {
  it('should have correct default values', () => {
    expect(pingfederate.authorizationUrl).toBe('/as/authorization.oauth2')
    expect(pingfederate.tokenUrl).toBe('/as/token.oauth2')
    expect(pingfederate.userInfoUrl).toBe('/idp/userinfo.openid')
    expect(pingfederate.logoutUrl).toBe('/idp/startSLO.ping')
    expect(pingfederate.scope).toEqual(['openid', 'profile', 'email'])
  })

  it('should have correct required properties', () => {
    expect(pingfederate.requiredProperties).toContain('baseUrl')
    expect(pingfederate.requiredProperties).toContain('clientId')
    expect(pingfederate.requiredProperties).toContain('clientSecret')
    expect(pingfederate.requiredProperties).toContain('authorizationUrl')
    expect(pingfederate.requiredProperties).toContain('tokenUrl')
  })
})
