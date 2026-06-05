import { type NextRequest } from "next/server"
import { requireAdmin, unauthorizedResponse } from "@/lib/auth-guard"
import { prisma } from "@/lib/prisma"

export async function GET() {
  const user = await requireAdmin()
  if (!user) return unauthorizedResponse()

  // There is at most one TictoConfig row; return it or a default
  let config = await prisma.tictoConfig.findFirst()

  if (!config) {
    config = await prisma.tictoConfig.create({
      data: {},
    })
  }

  // Mask the API key for display
  const masked = {
    ...config,
    apiKey: config.apiKey
      ? `${config.apiKey.slice(0, 4)}${"*".repeat(Math.max(0, config.apiKey.length - 8))}${config.apiKey.slice(-4)}`
      : null,
    webhookSecret: config.webhookSecret ? "••••••••" : null,
  }

  return Response.json(masked)
}

export async function PUT(request: NextRequest) {
  const user = await requireAdmin()
  if (!user) return unauthorizedResponse()

  try {
    const body = await request.json()

    let config = await prisma.tictoConfig.findFirst()

    const data = {
      urlBase: body.urlBase ?? null,
      ativo: body.ativo ?? false,
      // Only update secrets if non-empty strings are provided
      ...(body.apiKey && body.apiKey !== "••••••••" ? { apiKey: body.apiKey } : {}),
      ...(body.webhookSecret && body.webhookSecret !== "••••••••"
        ? { webhookSecret: body.webhookSecret }
        : {}),
    }

    if (!config) {
      config = await prisma.tictoConfig.create({ data })
    } else {
      config = await prisma.tictoConfig.update({ where: { id: config.id }, data })
    }

    return Response.json({ success: true, id: config.id })
  } catch (err) {
    const message = err instanceof Error ? err.message : "Erro interno"
    return Response.json({ error: message }, { status: 400 })
  }
}
