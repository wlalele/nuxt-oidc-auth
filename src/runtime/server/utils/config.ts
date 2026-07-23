export function generateProviderUrl(baseUrl: string, relativeUrl?: string) {
  const parsedUrl = parseURL(baseUrl)
  return parsedUrl.protocol
    ? withoutTrailingSlash(cleanDoubleSlashes(joinURL(baseUrl, '/', relativeUrl || '')))
    : withoutTrailingSlash(cleanDoubleSlashes(withHttps(joinURL(baseUrl, '/', relativeUrl || ''))))
}

export function resolveProviderUrl(
  config: OidcProviderConfig,
  preset: any,
  urlKey: keyof OidcProviderConfig,
) {
  const configUrl = config[urlKey] as string
  const presetUrl = preset[urlKey] as string

  // If the config already has a fully qualified URL, use it (backward compatibility)
  if (configUrl && (configUrl.startsWith('http') || configUrl.startsWith('//'))) {
    return configUrl
  }

  // If baseUrl is provided, generate the URL from baseUrl + preset relative path
  if (config.baseUrl) {
    return generateProviderUrl(config.baseUrl, presetUrl || '')
  }

  // Fallback to the preset URL
  return presetUrl || configUrl || ''
}

export function resolveRedirectUri(
  config: OidcProviderConfig,
  preset: any,
  provider: ProviderKeys,
) {
  const configUrl = config.redirectUri as string
  const presetUrl = preset.redirectUri as string

  // If the config already has a fully qualified URL, use it (backward compatibility)
  if (configUrl && (configUrl.startsWith('http') || configUrl.startsWith('//'))) {
    return configUrl
  }

  // Check for environment variable
  const envUrl = process.env[`NUXT_OIDC_PROVIDERS_${provider.toUpperCase()}_REDIRECT_URI`]
  if (envUrl) {
    return envUrl
  }

  // Fallback to the preset URL
  if (presetUrl) {
    return presetUrl
  }

  // Fallback to the config URL
  return configUrl || ''
}

export function replaceInjectedParameters(
  injectedParameters: Array<keyof OidcProviderConfig>,
  providerOptions: OidcProviderConfig,
  providerPreset: ProviderConfigs[keyof ProviderConfigs],
  provider: ProviderKeys,
): void {
  const additionalParameterKeys = [
    'additionalAuthParameters',
    'additionalTokenParameters',
    'additionalLogoutParameters',
  ] as Array<
    keyof Pick<
      OidcProviderConfig,
      'additionalAuthParameters' | 'additionalTokenParameters' | 'additionalLogoutParameters'
    >
  >
  additionalParameterKeys.forEach((parameterKey) => {
    const presetParams = providerPreset[parameterKey]
    if (!presetParams) return
    const providerParams = providerOptions[parameterKey]
    if (!providerParams) {
      providerOptions[parameterKey] = {}
    }
    Object.entries(presetParams).forEach(([key, value]) => {
      injectedParameters.forEach((injectedParameter) => {
        const placeholder = `{${injectedParameter}}`
        if ((value as string).includes(placeholder)) {
          providerOptions[parameterKey]![key] = (value as string).replace(
            placeholder,
            (providerOptions[injectedParameter] as string) ||
              process.env[
                `NUXT_OIDC_PROVIDERS_${provider.toUpperCase()}_${snakeCase(injectedParameter).toUpperCase()}`
              ] ||
              '',
          )
        }
      })
    })
  })
}