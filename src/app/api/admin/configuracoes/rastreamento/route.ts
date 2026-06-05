import { type NextRequest } from "next/server"
import { requireAdmin, unauthorizedResponse } from "@/lib/auth-guard"
import { prisma } from "@/lib/prisma"

export async function GET() {
  const user = await requireAdmin()
  if (!user) return unauthorizedResponse()

  let config = await prisma.siteConfig.findFirst()
  if (!config) {
    config = await prisma.siteConfig.create({ data: { id: "default" } })
  }

  return Response.json(config)
}

export async function PUT(request: NextRequest) {
  const user = await requireAdmin()
  if (!user) return unauthorizedResponse()

  try {
    const body = await request.json()

    const data = {
      metaPixelId: body.metaPixelId || null,
      googleAdsId: body.googleAdsId || null,
      googleAnalyticsId: body.googleAnalyticsId || null,
      googleSearchConsoleId: body.googleSearchConsoleId || null,
      metaDomainVerification: body.metaDomainVerification || null,
    }

    let config = await prisma.siteConfig.findFirst()
    if (!config) {
      config = await prisma.siteConfig.create({ data: { id: "default", ...data } })
    } else {
      config = await prisma.siteConfig.update({ where: { id: config.id }, data })
    }

    return Response.json({ success: true })
  } catch (err) {
    const message = err instanceof Error ? err.message : "Erro interno"
    return Response.json({ error: message }, { status: 400 })
  }
}
