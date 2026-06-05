import { type NextRequest } from "next/server"
import { requireAdmin, unauthorizedResponse } from "@/lib/auth-guard"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest) {
  const user = await requireAdmin()
  if (!user) return unauthorizedResponse()

  const { searchParams } = request.nextUrl
  const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10))
  const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") ?? "20", 10)))
  const skip = (page - 1) * limit
  const lida = searchParams.get("lida")

  const where = {
    ...(lida !== null ? { lida: lida === "true" } : {}),
  }

  const [data, total, totalNaoLidas] = await Promise.all([
    prisma.notification.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
    }),
    prisma.notification.count({ where }),
    prisma.notification.count({ where: { lida: false } }),
  ])

  return Response.json({
    data,
    totalNaoLidas,
    pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
  })
}

export async function PUT(request: NextRequest) {
  const user = await requireAdmin()
  if (!user) return unauthorizedResponse()

  try {
    const body = await request.json().catch(() => ({}))
    if ((body as { marcarTodasLidas?: boolean }).marcarTodasLidas) {
      await prisma.notification.updateMany({
        where: { lida: false },
        data: { lida: true },
      })
      return Response.json({ ok: true })
    }
    return Response.json({ error: "Acao nao reconhecida" }, { status: 400 })
  } catch (err) {
    const message = err instanceof Error ? err.message : "Erro interno"
    return Response.json({ error: message }, { status: 400 })
  }
}
