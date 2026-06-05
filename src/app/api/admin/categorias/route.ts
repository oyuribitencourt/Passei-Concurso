import { type NextRequest } from "next/server"
import { requireAdmin, unauthorizedResponse } from "@/lib/auth-guard"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest) {
  const user = await requireAdmin()
  if (!user) return unauthorizedResponse()

  const { searchParams } = request.nextUrl
  const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10))
  const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") ?? "50", 10)))
  const skip = (page - 1) * limit
  const search = searchParams.get("search") ?? ""
  const ativo = searchParams.get("ativo")

  const where = {
    ...(ativo !== null ? { ativo: ativo !== "false" } : {}),
    ...(search
      ? { nome: { contains: search, mode: "insensitive" as const } }
      : {}),
  }

  const [data, total] = await Promise.all([
    prisma.categoria.findMany({
      where,
      skip,
      take: limit,
      orderBy: [{ ordem: "asc" }, { nome: "asc" }],
      include: {
        _count: { select: { apostilas: true } },
      },
    }),
    prisma.categoria.count({ where }),
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

    const categoria = await prisma.categoria.create({
      data: {
        nome: body.nome,
        slug: body.slug,
        descricao: body.descricao ?? null,
        seoTitle: body.seoTitle ?? null,
        seoDescription: body.seoDescription ?? null,
        ativo: body.ativo ?? true,
        ordem: body.ordem ?? 0,
      },
    })

    return Response.json(categoria, { status: 201 })
  } catch (err) {
    const message = err instanceof Error ? err.message : "Erro interno"
    return Response.json({ error: message }, { status: 400 })
  }
}
