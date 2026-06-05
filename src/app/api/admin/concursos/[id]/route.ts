import { type NextRequest } from "next/server"
import { requireAdmin, unauthorizedResponse } from "@/lib/auth-guard"
import { prisma } from "@/lib/prisma"

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await requireAdmin()
  if (!user) return unauthorizedResponse()

  const { id } = await params

  const concurso = await prisma.concurso.findUnique({
    where: { id },
    include: {
      orgao: true,
      banca: true,
      apostilas: {
        select: { id: true, titulo: true, slug: true, status: true },
      },
    },
  })

  if (!concurso) {
    return Response.json({ error: "Concurso não encontrado" }, { status: 404 })
  }

  return Response.json(concurso)
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await requireAdmin()
  if (!user) return unauthorizedResponse()

  const { id } = await params

  try {
    const body = await request.json()

    const concurso = await prisma.concurso.update({
      where: { id },
      data: {
        nome: body.nome,
        slug: body.slug,
        estado: body.estado ?? null,
        cidade: body.cidade ?? null,
        cargos: body.cargos ?? null,
        nivel: body.nivel ?? null,
        area: body.area ?? null,
        status: body.status,
        ano: body.ano ? parseInt(body.ano, 10) : null,
        linkReferencia: body.linkReferencia ?? null,
        observacoes: body.observacoes ?? null,
        orgaoId: body.orgaoId ?? null,
        bancaId: body.bancaId ?? null,
      },
    })

    return Response.json(concurso)
  } catch (err) {
    const message = err instanceof Error ? err.message : "Erro interno"
    return Response.json({ error: message }, { status: 400 })
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await requireAdmin()
  if (!user) return unauthorizedResponse()

  const { id } = await params

  try {
    await prisma.concurso.delete({ where: { id } })
    return Response.json({ success: true })
  } catch (err) {
    const message = err instanceof Error ? err.message : "Erro interno"
    return Response.json({ error: message }, { status: 400 })
  }
}
