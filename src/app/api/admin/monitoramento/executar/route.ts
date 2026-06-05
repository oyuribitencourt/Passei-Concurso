import { type NextRequest } from "next/server"
import { requireAdmin, unauthorizedResponse } from "@/lib/auth-guard"
import { prisma } from "@/lib/prisma"
import { monitorSource } from "@/lib/sitemap-monitor"

export async function POST(request: NextRequest) {
  const user = await requireAdmin()
  if (!user) return unauthorizedResponse()

  try {
    const body = await request.json().catch(() => ({}))
    // Optional: pass a specific sourceId to run only one source
    const sourceId = (body as { sourceId?: string }).sourceId ?? null

    const where = {
      ativo: true,
      ...(sourceId ? { id: sourceId } : {}),
    }

    const fontes = await prisma.sitemapSource.findMany({ where })

    if (fontes.length === 0) {
      return Response.json({ error: "Nenhuma fonte ativa encontrada" }, { status: 404 })
    }

    const results = await Promise.all(
      fontes.map(async (fonte) => {
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
      fontesProcessadas: fontes.length,
      totalNewUrls,
      totalNewOpportunities,
      detalhes: results,
    })
  } catch (err) {
    const message = err instanceof Error ? err.message : "Erro interno"
    return Response.json({ error: message }, { status: 500 })
  }
}
