import { prisma } from "@/lib/prisma"

export const dynamic = "force-dynamic"

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://passeiconcurso.com.br"

function escapeXml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;")
}

function formatDate(date: Date): string {
  return date.toISOString().split("T")[0]
}

export async function GET() {
  const [apostilas, concursos, categorias] = await Promise.all([
    prisma.apostila.findMany({
      where: { status: "PUBLICADO" },
      select: { slug: true, updatedAt: true },
      orderBy: { updatedAt: "desc" },
    }),
    prisma.concurso.findMany({
      select: { slug: true, updatedAt: true },
      orderBy: { updatedAt: "desc" },
    }),
    prisma.categoria.findMany({
      where: { ativo: true },
      select: { slug: true, updatedAt: true },
      orderBy: { ordem: "asc" },
    }),
  ])

  const staticPages = [
    { loc: BASE_URL, changefreq: "daily", priority: "1.0" },
    { loc: `${BASE_URL}/busca`, changefreq: "daily", priority: "0.9" },
    { loc: `${BASE_URL}/apostilas`, changefreq: "daily", priority: "0.9" },
    { loc: `${BASE_URL}/concursos`, changefreq: "daily", priority: "0.8" },
    { loc: `${BASE_URL}/concursos-novos`, changefreq: "daily", priority: "0.8" },
    { loc: `${BASE_URL}/sobre`, changefreq: "monthly", priority: "0.5" },
    { loc: `${BASE_URL}/contato`, changefreq: "monthly", priority: "0.5" },
    {
      loc: `${BASE_URL}/politica-de-privacidade`,
      changefreq: "yearly",
      priority: "0.3",
    },
    {
      loc: `${BASE_URL}/termos-de-uso`,
      changefreq: "yearly",
      priority: "0.3",
    },
  ]

  const urlEntries: string[] = []

  // Static pages
  for (const page of staticPages) {
    urlEntries.push(`  <url>
    <loc>${escapeXml(page.loc)}</loc>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`)
  }

  // Category pages
  for (const cat of categorias) {
    urlEntries.push(`  <url>
    <loc>${escapeXml(`${BASE_URL}/categorias/${cat.slug}`)}</loc>
    <lastmod>${formatDate(cat.updatedAt)}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>`)
  }

  // Concurso pages
  for (const concurso of concursos) {
    urlEntries.push(`  <url>
    <loc>${escapeXml(`${BASE_URL}/concursos/${concurso.slug}`)}</loc>
    <lastmod>${formatDate(concurso.updatedAt)}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>`)
  }

  // Apostila pages
  for (const apostila of apostilas) {
    urlEntries.push(`  <url>
    <loc>${escapeXml(`${BASE_URL}/apostilas/${apostila.slug}`)}</loc>
    <lastmod>${formatDate(apostila.updatedAt)}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`)
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlEntries.join("\n")}
</urlset>`

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  })
}
