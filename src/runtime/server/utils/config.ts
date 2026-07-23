export function generateProviderUrl(baseUrl: string, relativeUrl?: string) {
  const parsedUrl = parseURL(baseUrl)
  return parsedUrl.protocol
    ? withoutTrailingSlash(cleanDoubleSlashes(joinURL(baseUrl, '/', relativeUrl || '')))
    : withoutTrailingSlash(cleanDoubleSlashes(withHttps(joinURL(baseUrl, '/', relativeUrl || ''))))
}