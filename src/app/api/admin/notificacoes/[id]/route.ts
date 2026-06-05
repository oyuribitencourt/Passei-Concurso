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
    const body = await request.json().catch(() => ({}))
    const lida = (body as { lida?: boolean }).lida ?? true

    const notificacao = await prisma.notification.update({
      where: { id },
      data: { lida },
    })

    return Response.json(notificacao)
  } catch (err) {
    const message = err instanceof Error ? err.message : "Erro interno"
    return Response.json({ error: message }, { status: 400 })
  }
}
