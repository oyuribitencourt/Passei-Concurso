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
  const ativo = searchParams.get("ativo")

  const where = {
    ...(ativo !== null ? { ativo: ativo !== "false" } : {}),
  }

  const [data, total] = await Promise.all([
    prisma.sitemapSource.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
      include: {
        _count: { select: { urls: true, logs: true } },
      },
    }),
    prisma.sitemapSource.count({ where }),
  ])

  return Response.json({
    data,
    pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
  })
}

export async function POST(request: NextRequest) {
  const user = await requireAdmin()
  if (!user) return unauthorizedResponse()

  try {
    const body = await request.json()

    const fonte = await prisma.sitemapSource.create({
      data: {
        nome: body.nome,
        url: body.url,
        ativo: body.ativo ?? true,
        intervaloHoras: body.intervaloHoras ?? 24,
      },
    })

    return Response.json(fonte, { status: 201 })
  } catch (err) {
    const message = err instanceof Error ? err.message : "Erro interno"
    return Response.json({ error: message }, { status: 400 })
  }
}
