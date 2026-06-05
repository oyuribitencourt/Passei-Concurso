import { type NextRequest } from "next/server"
import { requireAdmin, unauthorizedResponse } from "@/lib/auth-guard"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest) {
  const user = await requireAdmin()
  if (!user) return unauthorizedResponse()

  const { searchParams } = request.nextUrl
  const status = searchParams.get("status")
  const q = searchParams.get("q")?.trim()
  const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10))
  const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") ?? "20", 10)))

  const where = {
    ...(status ? { status: status as never } : {}),
    ...(q
      ? {
          OR: [
            { nomeProvavel: { contains: q, mode: "insensitive" as const } },
            { orgaoProvavel: { contains: q, mode: "insensitive" as const } },
            { cargoProvavel: { contains: q, mode: "insensitive" as const } },
          ],
        }
      : {}),
  }

  const [data, total] = await Promise.all([
    prisma.detectedOpportunity.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.detectedOpportunity.count({ where }),
  ])

  return Response.json(data)
}
