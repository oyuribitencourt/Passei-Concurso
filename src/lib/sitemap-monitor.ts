import { prisma } from "@/lib/prisma"
import { parseSitemapUrl } from "@/lib/sitemap-parser"
import { SitemapSource, LogTipo, NotificationType } from "@/generated/prisma"

// ---------------------------------------------------------------------------
// URL slug parser
// ---------------------------------------------------------------------------

const KNOWN_INSTITUTIONS = [
  "prefeitura",
  "tribunal",
  "ministerio",
  "secretaria",
  "defensoria",
  "procuradoria",
  "policia",
  "camara",
  "senado",
  "receita",
  "federal",
  "estadual",
  "municipal",
]

const ESTADO_MAP: Record<string, string> = {
  ac: "Acre",
  al: "Alagoas",
  am: "Amazonas",
  ap: "Amapá",
  ba: "Bahia",
  ce: "Ceará",
  df: "Distrito Federal",
  es: "Espírito Santo",
  go: "Goiás",
  ma: "Maranhão",
  mg: "Minas Gerais",
  ms: "Mato Grosso do Sul",
  mt: "Mato Grosso",
  pa: "Pará",
  pb: "Paraíba",
  pe: "Pernambuco",
  pi: "Piauí",
  pr: "Paraná",
  rj: "Rio de Janeiro",
  rn: "Rio Grande do Norte",
  ro: "Rondônia",
  rr: "Roraima",
  rs: "Rio Grande do Sul",
  sc: "Santa Catarina",
  se: "Sergipe",
  sp: "São Paulo",
  to: "Tocantins",
}

export interface ParsedSlugInfo {
  nomeProvavel: string | null
  orgaoProvavel: string | null
  estadoProvavel: string | null
  cargoProvavel: string | null
  categoriaProvavel: string | null
}

export function parseSlugInfo(url: string): ParsedSlugInfo {
  const result: ParsedSlugInfo = {
    nomeProvavel: null,
    orgaoProvavel: null,
    estadoProvavel: null,
    cargoProvavel: null,
    categoriaProvavel: null,
  }

  try {
    const pathname = new URL(url).pathname
    const slug = pathname.replace(/^\/|\/$/g, "").split("/").pop() ?? ""
    const parts = slug.toLowerCase().split("-")

    // Detect estado by 2-letter sigla
    for (const part of parts) {
      if (ESTADO_MAP[part]) {
        result.estadoProvavel = ESTADO_MAP[part]
        break
      }
    }

    // Detect orgao by looking for known institutional keywords
    const orgaoParts: string[] = []
    let capturing = false
    for (const part of parts) {
      if (
        KNOWN_INSTITUTIONS.includes(part) ||
        part === "tj" ||
        part === "mp" ||
        part === "trf" ||
        part === "tse" ||
        part === "tst" ||
        part === "stj" ||
        part === "stf"
      ) {
        capturing = true
      }
      if (capturing && part !== "concurso" && part !== "apostila") {
        orgaoParts.push(part)
      }
    }

    if (orgaoParts.length > 0) {
      result.orgaoProvavel = orgaoParts
        .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
        .join(" ")
    }

    // Derive a legible name from the slug
    const skipWords = new Set(["de", "do", "da", "dos", "das", "e", "para"])
    const nomeWords = parts.filter((p) => !skipWords.has(p))
    result.nomeProvavel = nomeWords
      .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
      .join(" ")
      .slice(0, 120)

    // Guess category
    if (parts.includes("policia") || parts.includes("militar")) {
      result.categoriaProvavel = "Segurança Pública"
    } else if (parts.includes("educacao") || parts.includes("professor")) {
      result.categoriaProvavel = "Educação"
    } else if (parts.includes("saude") || parts.includes("enfermagem")) {
      result.categoriaProvavel = "Saúde"
    } else if (
      parts.includes("fiscal") ||
      parts.includes("receita") ||
      parts.includes("tributario")
    ) {
      result.categoriaProvavel = "Fiscal / Tributário"
    } else if (parts.includes("tribunal") || parts.includes("tj")) {
      result.categoriaProvavel = "Judiciário"
    }

    // Cargo: last substantial word after "cargo" or "para"
    const cargoIdx = parts.indexOf("cargo")
    if (cargoIdx !== -1 && parts[cargoIdx + 1]) {
      result.cargoProvavel = parts[cargoIdx + 1]
    }
  } catch {
    // ignore malformed URLs
  }

  return result
}

// ---------------------------------------------------------------------------
// Main monitor function
// ---------------------------------------------------------------------------

export async function monitorSource(source: SitemapSource): Promise<{
  newUrls: number
  newOpportunities: number
  errors: string[]
}> {
  const errors: string[] = []
  let newUrls = 0
  let newOpportunities = 0

  // Create a log helper
  async function log(tipo: LogTipo, mensagem: string, detalhes?: string) {
    await prisma.monitorLog.create({
      data: { sourceId: source.id, tipo, mensagem, detalhes },
    })
  }

  try {
    await log(LogTipo.INFO, `Iniciando monitoramento de ${source.url}`)

    // Fetch & parse the sitemap
    let entries: Awaited<ReturnType<typeof parseSitemapUrl>>
    try {
      entries = await parseSitemapUrl(source.url)
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err)
      await log(LogTipo.ERRO, `Falha ao buscar sitemap: ${msg}`)
      await prisma.sitemapSource.update({
        where: { id: source.id },
        data: {
          ultimaVerificacao: new Date(),
          ultimoStatus: "ERRO",
        },
      })
      await prisma.notification.create({
        data: {
          tipo: NotificationType.FONTE_FALHOU,
          titulo: `Fonte falhou: ${source.nome}`,
          mensagem: `Não foi possível buscar o sitemap de ${source.url}. Erro: ${msg}`,
          link: `/admin/monitoramento/fontes`,
        },
      })
      return { newUrls: 0, newOpportunities: 0, errors: [msg] }
    }

    await log(
      LogTipo.INFO,
      `${entries.length} URLs encontradas no sitemap`,
      `Fonte: ${source.url}`
    )

    // Load existing URLs for this source (just the url strings)
    const existingUrls = await prisma.sitemapUrl.findMany({
      where: { sourceId: source.id },
      select: { url: true },
    })
    const existingSet = new Set(existingUrls.map((u) => u.url))

    // Process new URLs
    const novelEntries = entries.filter((e) => !existingSet.has(e.url))

    for (const entry of novelEntries) {
      try {
        const parsed = parseSlugInfo(entry.url)

        // Create the opportunity first
        const opportunity = await prisma.detectedOpportunity.create({
          data: {
            urlOriginal: entry.url,
            nomeProvavel: parsed.nomeProvavel,
            orgaoProvavel: parsed.orgaoProvavel,
            estadoProvavel: parsed.estadoProvavel,
            cargoProvavel: parsed.cargoProvavel,
            categoriaProvavel: parsed.categoriaProvavel,
          },
        })

        // Create the SitemapUrl linked to the opportunity
        await prisma.sitemapUrl.create({
          data: {
            sourceId: source.id,
            url: entry.url,
            lastmod: entry.lastmod ? new Date(entry.lastmod) : null,
            opportunityId: opportunity.id,
          },
        })

        newUrls++
        newOpportunities++
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err)
        errors.push(`Erro ao processar ${entry.url}: ${msg}`)
      }
    }

    // Create notification if many new URLs were found
    if (newUrls > 10) {
      await prisma.notification.create({
        data: {
          tipo: NotificationType.MUITAS_URLS,
          titulo: `${newUrls} novas URLs detectadas em ${source.nome}`,
          mensagem: `O sitemap de ${source.url} retornou ${newUrls} URLs novas nesta varredura.`,
          link: `/admin/monitoramento/novidades`,
        },
      })
    } else if (newUrls > 0) {
      await prisma.notification.create({
        data: {
          tipo: NotificationType.NOVA_URL,
          titulo: `${newUrls} nova(s) URL(s) detectada(s) em ${source.nome}`,
          mensagem: `Foram encontradas ${newUrls} novas URLs no sitemap de ${source.url}.`,
          link: `/admin/monitoramento/novidades`,
        },
      })
    }

    // Update source stats
    const totalUrls = await prisma.sitemapUrl.count({
      where: { sourceId: source.id },
    })

    await prisma.sitemapSource.update({
      where: { id: source.id },
      data: {
        ultimaVerificacao: new Date(),
        ultimoStatus: errors.length > 0 ? "PARCIAL" : "OK",
        totalUrlsEncontradas: totalUrls,
      },
    })

    await log(
      LogTipo.SUCESSO,
      `Monitoramento concluído: ${newUrls} novas URLs, ${newOpportunities} oportunidades`,
      errors.length > 0 ? `Erros: ${errors.join("; ")}` : undefined
    )
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    errors.push(msg)
    await log(LogTipo.ERRO, `Erro inesperado durante monitoramento: ${msg}`)
  }

  return { newUrls, newOpportunities, errors }
}
