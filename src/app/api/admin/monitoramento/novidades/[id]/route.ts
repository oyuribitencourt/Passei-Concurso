import { type NextRequest } from "next/server"
import { requireAdmin, unauthorizedResponse } from "@/lib/auth-guard"
import { prisma } from "@/lib/prisma"

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await requireAdmin()
  if (!user) return unauthorizedResponse()

  const { id } = await params

  try {
    const body = await request.json()
    const updated = await prisma.detectedOpportunity.update({
      where: { id },
      data: {
        ...(body.status ? { status: body.status } : {}),
        ...(body.notas !== undefined ? { notas: body.notas } : {}),
        ...(body.apostilaId !== undefined ? { apostilaId: body.apostilaId } : {}),
      },
    })
    return Response.json(updated)
  } catch (err) {
    const message = err instanceof Error ? err.message : "Erro interno"
    return Response.json({ error: message }, { status: 400 })
  }
}
