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

  const apostila = await prisma.apostila.findUnique({
    where: { id },
    include: {
      categoria: true,
      banca: true,
      orgao: true,
      concurso: true,
    },
  })

  if (!apostila) {
    return Response.json({ error: "Apostila não encontrada" }, { status: 404 })
  }

  return Response.json(apostila)
}

function connectOrDisconnect(newId: string | null | undefined, currentField: string) {
  if (newId) return { connect: { id: newId } }
  return { disconnect: true }
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

    const apostila = await prisma.apostila.update({
      where: { id },
      data: {
        titulo: body.titulo,
        slug: body.slug,
        descricaoCurta: body.descricaoCurta,
        descricaoLonga: body.descricaoLonga,
        cargo: body.cargo ?? null,
        estado: body.estado ?? null,
        cidade: body.cidade ?? null,
        nivel: body.nivel ?? null,
        area: body.area ?? null,
        ano: body.ano ? parseInt(body.ano, 10) : null,
        statusConcurso: body.statusConcurso,
        status: body.status,
        categoria: body.categoriaId ? { connect: { id: body.categoriaId } } : { disconnect: true },
        banca: body.bancaId ? { connect: { id: body.bancaId } } : { disconnect: true },
        orgao: body.orgaoId ? { connect: { id: body.orgaoId } } : { disconnect: true },
        concurso: body.concursoId ? { connect: { id: body.concursoId } } : { disconnect: true },
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

    return Response.json(apostila)
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
    await prisma.apostila.delete({ where: { id } })
    return Response.json({ success: true })
  } catch (err) {
    const message = err instanceof Error ? err.message : "Erro interno"
    return Response.json({ error: message }, { status: 400 })
  }
}
