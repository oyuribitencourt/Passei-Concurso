import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { ConcursoForm } from "@/components/admin/concurso-form"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export const dynamic = 'force-dynamic';

export default async function NovoConcursoPage() {
  const session = await auth()
  if (!session?.user) redirect("/admin/login")

  const [orgaos, bancas] = await Promise.all([
    prisma.orgao.findMany({ orderBy: { nome: "asc" }, select: { id: true, nome: true } }),
    prisma.banca.findMany({ orderBy: { nome: "asc" }, select: { id: true, nome: true } }),
  ])

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/admin/concursos" className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Novo Concurso</h1>
          <p className="text-sm text-slate-500">Cadastre um novo concurso</p>
        </div>
      </div>
      <ConcursoForm orgaos={orgaos} bancas={bancas} />
    </div>
  )
}
