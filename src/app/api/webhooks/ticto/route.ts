import { type NextRequest } from "next/server"
import { prisma } from "@/lib/prisma"

export async function POST(request: NextRequest) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    request.headers.get("x-real-ip") ??
    null

  let rawPayload = ""
  let evento = "UNKNOWN"
  let status = "RECEBIDO"

  try {
    rawPayload = await request.text()

    let parsed: Record<string, unknown> = {}
    try {
      parsed = JSON.parse(rawPayload)
    } catch {
      // not JSON, store raw
    }

    evento =
      typeof parsed["evento"] === "string"
        ? parsed["evento"]
        : typeof parsed["event"] === "string"
          ? parsed["event"]
          : "UNKNOWN"

    // Optionally verify webhook secret
    const config = await prisma.tictoConfig.findFirst()
    const secret = config?.webhookSecret
    const providedSignature = request.headers.get("x-ticto-signature")

    if (secret && providedSignature) {
      // Signature verification placeholder - implement HMAC if Ticto documents it
      // For now we just log whether a signature was present
      status = "RECEBIDO_COM_ASSINATURA"
    }

    await prisma.tictoWebhookLog.create({
      data: {
        evento,
        payload: rawPayload,
        status,
        ip,
      },
    })

    return Response.json({ received: true })
  } catch (err) {
    const message = err instanceof Error ? err.message : "Erro interno"

    // Still try to log the failure
    try {
      await prisma.tictoWebhookLog.create({
        data: {
          evento,
          payload: rawPayload || "{}",
          status: "ERRO",
          ip,
        },
      })
    } catch {
      // ignore secondary error
    }

    return Response.json({ error: message }, { status: 500 })
  }
}
