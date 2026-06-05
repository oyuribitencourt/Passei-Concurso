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

  const search = searchParams.get("search") ?? ""
  const status = searchParams.get("status") ?? ""
  const estado = searchParams.get("estado") ?? ""

  const where = {
    ...(status ? { status: status as never } : {}),
    ...(estado ? { estado } : {}),
    ...(search
      ? {
          OR: [
            { nome: { contains: search, mode: "insensitive" as const } },
            { slug: { contains: search, mode: "insensitive" as const } },
          ],
        }
      : {}),
  }

  const [data, total] = await Promise.all([
    prisma.concurso.findMany({
      where,
      skip,
      take: limit,
      orderBy: { updatedAt: "desc" },
      include: {
        orgao: { select: { id: true, nome: true, sigla: true } },
        banca: { select: { id: true, nome: true } },
        _count: { select: { apostilas: true } },
      },
    }),
    prisma.concurso.count({ where }),
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

    const concurso = await prisma.concurso.create({
      data: {
        nome: body.nome,
        slug: body.slug,
        estado: body.estado ?? null,
        cidade: body.cidade ?? null,
        cargos: body.cargos ?? null,
        nivel: body.nivel ?? null,
        area: body.area ?? null,
        status: body.status ?? "ABERTO",
        ano: body.ano ? parseInt(body.ano, 10) : null,
        linkReferencia: body.linkReferencia ?? null,
        observacoes: body.observacoes ?? null,
        orgaoId: body.orgaoId ?? null,
        bancaId: body.bancaId ?? null,
      },
    })

    return Response.json(concurso, { status: 201 })
  } catch (err) {
    const message = err instanceof Error ? err.message : "Erro interno"
    return Response.json({ error: message }, { status: 400 })
  }
}
