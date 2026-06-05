import { type NextRequest } from "next/server"
import { prisma } from "@/lib/prisma"
import { monitorSource } from "@/lib/sitemap-monitor"

export async function GET(request: NextRequest) {
  const cronSecret = process.env.CRON_SECRET
  const authHeader = request.headers.get("authorization")

  if (!cronSecret) {
    return Response.json(
      { error: "CRON_SECRET nao configurado no servidor" },
      { status: 500 }
    )
  }

  if (authHeader !== `Bearer ${cronSecret}`) {
    return Response.json({ error: "Nao autorizado" }, { status: 401 })
  }

  try {
    // Only process active sources that are due (last check older than intervaloHoras)
    const agora = new Date()

    const fontes = await prisma.sitemapSource.findMany({
      where: { ativo: true },
    })

    const fontesDevidas = fontes.filter((fonte) => {
      if (!fonte.ultimaVerificacao) return true
      const diffHoras =
        (agora.getTime() - fonte.ultimaVerificacao.getTime()) / (1000 * 60 * 60)
      return diffHoras >= fonte.intervaloHoras
    })

    if (fontesDevidas.length === 0) {
      return Response.json({
        success: true,
        message: "Nenhuma fonte com verificacao pendente",
        fontesDevidas: 0,
      })
    }

    const results = await Promise.all(
      fontesDevidas.map(async (fonte) => {
        const result = await monitorSource(fonte)
        return { sourceId: fonte.id, nome: fonte.nome, ...result }
      })
    )

    const totalNewUrls = results.reduce((acc, r) => acc + r.newUrls, 0)
    const totalNewOpportunities = results.reduce(
      (acc, r) => acc + r.newOpportunities,
      0
    )

    return Response.json({
      success: true,
      fontesProcessadas: fontesDevidas.length,
      totalNewUrls,
      totalNewOpportunities,
      detalhes: results,
    })
  } catch (err) {
    const message = err instanceof Error ? err.message : "Erro interno"
    return Response.json({ error: message }, { status: 500 })
  }
}
