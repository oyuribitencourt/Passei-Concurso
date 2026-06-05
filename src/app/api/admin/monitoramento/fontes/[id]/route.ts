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

  const fonte = await prisma.sitemapSource.findUnique({
    where: { id },
    include: {
      _count: { select: { urls: true } },
      logs: {
        orderBy: { createdAt: "desc" },
        take: 20,
      },
    },
  })

  if (!fonte) {
    return Response.json({ error: "Fonte não encontrada" }, { status: 404 })
  }

  return Response.json(fonte)
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

    const fonte = await prisma.sitemapSource.update({
      where: { id },
      data: {
        nome: body.nome,
        url: body.url,
        ativo: body.ativo,
        intervaloHoras: body.intervaloHoras ?? 24,
      },
    })

    return Response.json(fonte)
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
    await prisma.sitemapSource.delete({ where: { id } })
    return Response.json({ success: true })
  } catch (err) {
    const message = err instanceof Error ? err.message : "Erro interno"
    return Response.json({ error: message }, { status: 400 })
  }
}
