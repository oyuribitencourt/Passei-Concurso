import { requireAdmin, unauthorizedResponse } from "@/lib/auth-guard"
import { writeFile, mkdir } from "fs/promises"
import path from "path"
import { randomUUID } from "crypto"

export async function POST(request: Request) {
  const user = await requireAdmin()
  if (!user) return unauthorizedResponse()

  try {
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
    const filename = `${randomUUID()}.${ext}`

    // Ensure upload directory exists
    const uploadDir = path.join(process.cwd(), "public", "uploads", folder)
    await mkdir(uploadDir, { recursive: true })

    // Write file
    const buffer = Buffer.from(await file.arrayBuffer())
    const filePath = path.join(uploadDir, filename)
    await writeFile(filePath, buffer)

    // Return public URL
    const url = `/uploads/${folder}/${filename}`

    return Response.json({ url, filename, size: file.size })
  } catch (error) {
    console.error("Erro no upload:", error)
    return Response.json({ error: "Erro ao fazer upload do arquivo" }, { status: 500 })
  }
}
