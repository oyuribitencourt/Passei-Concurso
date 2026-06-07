import { requireAdmin, unauthorizedResponse } from "@/lib/auth-guard"
import { put } from "@vercel/blob"
import { randomUUID } from "crypto"

export const runtime = "nodejs"
export const maxDuration = 30

export async function POST(request: Request) {
  try {
    const user = await requireAdmin()
    if (!user) return unauthorizedResponse()

    if (!process.env.BLOB_READ_WRITE_TOKEN) {
      return Response.json(
        { error: "BLOB_READ_WRITE_TOKEN não configurado no servidor" },
        { status: 500 }
      )
    }

    const formData = await request.formData()
    const file = formData.get("file") as File | null
    const folder = (formData.get("folder") as string) || "apostilas"

    if (!file) {
      return Response.json({ error: "Nenhum arquivo enviado" }, { status: 400 })
    }

    // Validate file type
    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"]
    if (!allowedTypes.includes(file.type)) {
      return Response.json(
        { error: "Tipo de arquivo não permitido. Use JPG, PNG, WebP ou GIF." },
        { status: 400 }
      )
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024
    if (file.size > maxSize) {
      return Response.json(
        { error: "Arquivo muito grande. Tamanho máximo: 5MB." },
        { status: 400 }
      )
    }

    // Generate unique filename
    const ext = file.name.split(".").pop()?.toLowerCase() || "png"
    const filename = `${folder}/${randomUUID()}.${ext}`

    // Upload to Vercel Blob
    const blob = await put(filename, file, {
      access: "public",
      addRandomSuffix: false,
    })

    return Response.json({ url: blob.url, filename, size: file.size })
  } catch (error) {
    console.error("Erro no upload:", error)
    const message = error instanceof Error ? error.message : JSON.stringify(error)
    return Response.json({ error: `[UPLOAD_V2] ${message}` }, { status: 500 })
  }
}
