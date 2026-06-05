import { MetadataRoute } from "next"
import { prisma } from "@/lib/prisma"

export const dynamic = "force-dynamic"

const UFS = [
  "AC","AL","AP","AM","BA","CE","DF","ES","GO","MA","MT","MS","MG",
  "PA","PB","PR","PE","PI","RJ","RN","RS","RO","RR","SC","SP","SE","TO",
]

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://passeiconcurso.com.br"

  const [apostilas, categorias, concursos, bancas, orgaos] = await Promise.all([
    prisma.apostila.findMany({
      where: { status: "PUBLICADO" },
      select: { slug: true, updatedAt: true },
    }),
    prisma.categoria.findMany({
      where: { ativo: true },
      select: { slug: true, updatedAt: true },
    }),
    prisma.concurso.findMany({
      select: { slug: true, updatedAt: true },
    }),
    prisma.banca.findMany({
      select: { slug: true },
    }),
    prisma.orgao.findMany({
      select: { slug: true },
    }),
  ])

  // Páginas estáticas
  const staticPages: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: "daily", priority: 1 },
    { url: `${baseUrl}/apostilas`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    { url: `${baseUrl}/categorias`, lastModified: new Date(), changeFrequency: "daily", priority: 0.8 },
    { url: `${baseUrl}/busca`, lastModified: new Date(), changeFrequency: "daily", priority: 0.8 },
    { url: `${baseUrl}/concursos-novos`, lastModified: new Date(), changeFrequency: "daily", priority: 0.7 },
    { url: `${baseUrl}/sobre`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.3 },
    { url: `${baseUrl}/contato`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.3 },
    { url: `${baseUrl}/politica-de-privacidade`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.1 },
    { url: `${baseUrl}/termos-de-uso`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.1 },
  ]

  // Apostilas individuais (prioridade máxima — são as páginas de conversão)
  const apostilaPages: MetadataRoute.Sitemap = apostilas.map((a) => ({
    url: `${baseUrl}/apostilas/${a.slug}`,
    lastModified: a.updatedAt,
    changeFrequency: "weekly" as const,
    priority: 0.9,
  }))

  // Categorias
  const categoriaPages: MetadataRoute.Sitemap = categorias.map((c) => ({
    url: `${baseUrl}/categorias/${c.slug}`,
    lastModified: c.updatedAt,
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }))

  // Concursos
  const concursoPages: MetadataRoute.Sitemap = concursos.map((c) => ({
    url: `${baseUrl}/concursos/${c.slug}`,
    lastModified: c.updatedAt,
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }))

  // Bancas
  const bancaPages: MetadataRoute.Sitemap = bancas.map((b) => ({
    url: `${baseUrl}/apostilas/banca/${b.slug}`,
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }))

  // Órgãos
  const orgaoPages: MetadataRoute.Sitemap = orgaos.map((o) => ({
    url: `${baseUrl}/apostilas/orgao/${o.slug}`,
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }))

  // Estados (UFs)
  const estadoPages: MetadataRoute.Sitemap = UFS.map((uf) => ({
    url: `${baseUrl}/apostilas/estado/${uf}`,
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }))

  return [
    ...staticPages,
    ...apostilaPages,
    ...categoriaPages,
    ...concursoPages,
    ...bancaPages,
    ...orgaoPages,
    ...estadoPages,
  ]
}
