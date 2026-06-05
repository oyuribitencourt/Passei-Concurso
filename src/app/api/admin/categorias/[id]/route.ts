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

  const categoria = await prisma.categoria.findUnique({
    where: { id },
    include: {
      _count: { select: { apostilas: true } },
    },
  })

  if (!categoria) {
    return Response.json({ error: "Categoria não encontrada" }, { status: 404 })
  }

  return Response.json(categoria)
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

    const categoria = await prisma.categoria.update({
      where: { id },
      data: {
        nome: body.nome,
        slug: body.slug,
        descricao: body.descricao ?? null,
        seoTitle: body.seoTitle ?? null,
        seoDescription: body.seoDescription ?? null,
        ativo: body.ativo,
        ordem: body.ordem ?? 0,
      },
    })

    return Response.json(categoria)
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
    await prisma.categoria.delete({ where: { id } })
    return Response.json({ success: true })
  } catch (err) {
    const message = err instanceof Error ? err.message : "Erro interno"
    return Response.json({ error: message }, { status: 400 })
  }
}
