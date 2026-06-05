import { type NextRequest } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl

  const q = searchParams.get("q") ?? ""
  const estado = searchParams.get("estado") ?? ""
  const banca = searchParams.get("banca") ?? ""
  const categoria = searchParams.get("categoria") ?? ""
  const nivel = searchParams.get("nivel") ?? ""
  const area = searchParams.get("area") ?? ""
  const cargo = searchParams.get("cargo") ?? ""
  const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10))
  const limit = Math.min(50, Math.max(1, parseInt(searchParams.get("limit") ?? "12", 10)))
  const skip = (page - 1) * limit

  const where = {
    status: "PUBLICADO" as const,
    ...(estado ? { estado } : {}),
    ...(nivel ? { nivel: nivel as never } : {}),
    ...(area ? { area: { contains: area, mode: "insensitive" as const } } : {}),
    ...(cargo
      ? { cargo: { contains: cargo, mode: "insensitive" as const } }
      : {}),
    ...(banca
      ? { banca: { slug: banca } }
      : {}),
    ...(categoria
      ? { categoria: { slug: categoria } }
      : {}),
    ...(q
      ? {
          OR: [
            { titulo: { contains: q, mode: "insensitive" as const } },
            { descricaoCurta: { contains: q, mode: "insensitive" as const } },
            { cargo: { contains: q, mode: "insensitive" as const } },
            { area: { contains: q, mode: "insensitive" as const } },
            { keywords: { contains: q, mode: "insensitive" as const } },
            {
              orgao: {
                nome: { contains: q, mode: "insensitive" as const },
              },
            },
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
      select: {
        id: true,
        titulo: true,
        slug: true,
        descricaoCurta: true,
        cargo: true,
        estado: true,
        nivel: true,
        area: true,
        precoExibido: true,
        imagemCapa: true,
        statusConcurso: true,
        categoria: { select: { nome: true, slug: true } },
        banca: { select: { nome: true, slug: true } },
        orgao: { select: { nome: true, sigla: true } },
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
    filtrosAtivos: {
      q: q || null,
      estado: estado || null,
      banca: banca || null,
      categoria: categoria || null,
      nivel: nivel || null,
      area: area || null,
      cargo: cargo || null,
    },
  })
}
