import { parseStringPromise } from "xml2js"

export interface SitemapEntry {
  url: string
  lastmod?: string
}

const USER_AGENT =
  "ApostilasDigitalBot/1.0 (+https://apostilasdigital.com.br/bot)"
const TIMEOUT_MS = 30_000

async function fetchWithTimeout(url: string): Promise<string> {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS)

  try {
    const res = await fetch(url, {
      signal: controller.signal,
      headers: {
        "User-Agent": USER_AGENT,
        Accept: "application/xml, text/xml, */*",
      },
    })

    if (!res.ok) {
      throw new Error(`HTTP ${res.status} ao buscar ${url}`)
    }

    return await res.text()
  } finally {
    clearTimeout(timer)
  }
}

function isSitemapIndex(parsed: Record<string, unknown>): boolean {
  return "sitemapindex" in parsed
}

async function parseSitemapIndex(
  parsed: Record<string, unknown>
): Promise<SitemapEntry[]> {
  const index = parsed["sitemapindex"] as Record<string, unknown>
  const sitemaps = (index["sitemap"] as Array<Record<string, string[]>>) ?? []
  const results: SitemapEntry[] = []

  for (const sitemap of sitemaps) {
    const loc = sitemap["loc"]?.[0]
    if (!loc) continue
    try {
      const entries = await parseSitemapUrl(loc)
      results.push(...entries)
    } catch {
      // skip failed sub-sitemaps
    }
  }

  return results
}

function parseUrlSet(parsed: Record<string, unknown>): SitemapEntry[] {
  const urlset = parsed["urlset"] as Record<string, unknown>
  const urls = (urlset?.["url"] as Array<Record<string, string[]>>) ?? []

  return urls
    .map((u) => ({
      url: u["loc"]?.[0] ?? "",
      lastmod: u["lastmod"]?.[0],
    }))
    .filter((e) => e.url.length > 0)
}

export async function parseSitemapUrl(url: string): Promise<SitemapEntry[]> {
  const xml = await fetchWithTimeout(url)

  const parsed = (await parseStringPromise(xml, {
    explicitArray: true,
    ignoreAttrs: false,
  })) as Record<string, unknown>

  if (isSitemapIndex(parsed)) {
    return parseSitemapIndex(parsed)
  }

  return parseUrlSet(parsed)
}
