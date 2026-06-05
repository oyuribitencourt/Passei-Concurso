import { type NextRequest } from "next/server"
import { requireAdmin, unauthorizedResponse } from "@/lib/auth-guard"
import { prisma } from "@/lib/prisma"
import { StatusApostila } from "@/generated/prisma"

export async function GET(request: NextRequest) {
  const user = await requireAdmin()
  if (!user) return unauthorizedResponse()

  const { searchParams } = request.nextUrl
  const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10))
  const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") ?? "20", 10)))
  const skip = (page - 1) * limit

  const status = searchParams.get("status") as StatusApostila | null
  const search = searchParams.get("search") ?? ""
  const categoriaId = searchParams.get("categoriaId") ?? ""
  const estado = searchParams.get("estado") ?? ""

  const where = {
    ...(status ? { status } : {}),
    ...(categoriaId ? { categoriaId } : {}),
    ...(estado ? { estado } : {}),
    ...(search
      ? {
          OR: [
            { titulo: { contains: search, mode: "insensitive" as const } },
            { slug: { contains: search, mode: "insensitive" as const } },
            { cargo: { contains: search, mode: "insensitive" as const } },
          ],
        }
      : {}),
  }

  const [data, total] = await Promise.all([
    prisma.apostila.findMany({
      where,
      skip,
      take: limit,
      orderBy: { updatedAt: "desc" },
      include: {
        categoria: { select: { id: true, nome: true } },
        banca: { select: { id: true, nome: true } },
        orgao: { select: { id: true, nome: true, sigla: true } },
      },
    }),
    prisma.apostila.count({ where }),
  ])

  return Response.json({
    data,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  })
}

export async function POST(request: NextRequest) {
  const user = await requireAdmin()
  if (!user) return unauthorizedResponse()

  try {
    const body = await request.json()

    const apostila = await prisma.apostila.create({
      data: {
        titulo: body.titulo,
        slug: body.slug,
        descricaoCurta: body.descricaoCurta ?? "",
        descricaoLonga: body.descricaoLonga ?? "",
        cargo: body.cargo ?? null,
        estado: body.estado ?? null,
        cidade: body.cidade ?? null,
        nivel: body.nivel ?? null,
        area: body.area ?? null,
        ano: body.ano ? parseInt(body.ano, 10) : null,
        statusConcurso: body.statusConcurso ?? "ABERTO",
        status: body.status ?? "RASCUNHO",
        categoriaId: body.categoriaId ?? null,
        bancaId: body.bancaId ?? null,
        orgaoId: body.orgaoId ?? null,
        concursoId: body.concursoId ?? null,
        linkCheckoutTicto: body.linkCheckoutTicto ?? null,
        idProdutoTicto: body.idProdutoTicto ?? null,
        precoOriginal: body.precoOriginal ?? null,
        precoExibido: body.precoExibido ?? null,
        imagemCapa: body.imagemCapa ?? null,
        imagemMockup: body.imagemMockup ?? null,
        imagemMockup2: body.imagemMockup2 ?? null,
        imagemMockup3: body.imagemMockup3 ?? null,
        imagemHeroBg: body.imagemHeroBg ?? null,
        conteudoProgramatico: body.conteudoProgramatico ?? null,
        beneficios: body.beneficios ?? null,
        publicoAlvo: body.publicoAlvo ?? null,
        faq: body.faq ?? null,
        seoTitle: body.seoTitle ?? null,
        seoDescription: body.seoDescription ?? null,
        keywords: body.keywords ?? null,
        canonicalUrl: body.canonicalUrl ?? null,
      },
    })

    return Response.json(apostila, { status: 201 })
  } catch (err) {
    const message = err instanceof Error ? err.message : "Erro interno"
    return Response.json({ error: message }, { status: 400 })
  }
}
