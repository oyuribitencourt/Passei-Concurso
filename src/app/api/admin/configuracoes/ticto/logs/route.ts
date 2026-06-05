import { requireAdmin, unauthorizedResponse } from "@/lib/auth-guard"
import { prisma } from "@/lib/prisma"

export async function GET() {
  const user = await requireAdmin()
  if (!user) return unauthorizedResponse()

  const logs = await prisma.tictoWebhookLog.findMany({
    orderBy: { createdAt: "desc" },
    take: 50,
  })

  return Response.json(logs)
}
