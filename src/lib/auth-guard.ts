import { auth } from "./auth"
import { NextResponse } from "next/server"

export async function requireAdmin() {
  const session = await auth()
  if (!session?.user) {
    return null
  }
  return session.user
}

export function unauthorizedResponse() {
  return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
}
