import { requireAdmin, unauthorizedResponse } from "@/lib/auth-guard"
import { prisma } from "@/lib/prisma"

export async function GET() {
  const user = await requireAdmin()
  if (!user) return unauthorizedResponse()

  const [
    totalApostilas,
    apostilasPublicadas,
    apostilasRascunho,
    apostilasPausadas,
    apostilasPendentes,
    totalConcursos,
    concursosAbertos,
    totalCategorias,
    totalFontes,
    totalOportunidades,
    oportunidadesNovas,
    notificacoesNaoLidas,
    ultimasApostilas,
    ultimasOportunidades,
  ] = await Promise.all([
    prisma.apostila.count(),
    prisma.apostila.count({ where: { status: "PUBLICADO" } }),
    prisma.apostila.count({ where: { status: "RASCUNHO" } }),
    prisma.apostila.count({ where: { status: "PAUSADO" } }),
    prisma.apostila.count({ where: { status: "PENDENTE_REVISAO" } }),
    prisma.concurso.count(),
    prisma.concurso.count({ where: { status: "ABERTO" } }),
    prisma.categoria.count({ where: { ativo: true } }),
    prisma.sitemapSource.count({ where: { ativo: true } }),
    prisma.detectedOpportunity.count(),
    prisma.detectedOpportunity.count({ where: { status: "NOVA" } }),
    prisma.notification.count({ where: { lida: false } }),
    prisma.apostila.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        titulo: true,
        slug: true,
        status: true,
        createdAt: true,
      },
    }),
    prisma.detectedOpportunity.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        urlOriginal: true,
        nomeProvavel: true,
        orgaoProvavel: true,
        status: true,
        createdAt: true,
      },
    }),
  ])

  return Response.json({
    apostilas: {
      total: totalApostilas,
      publicadas: apostilasPublicadas,
      rascunho: apostilasRascunho,
      pausadas: apostilasPausadas,
      pendentes: apostilasPendentes,
    },
    concursos: {
      total: totalConcursos,
      abertos: concursosAbertos,
    },
    categorias: {
      total: totalCategorias,
    },
    monitoramento: {
      fontesAtivas: totalFontes,
      totalOportunidades,
      oportunidadesNovas,
    },
    notificacoesNaoLidas,
    ultimasApostilas,
    ultimasOportunidades,
  })
}
