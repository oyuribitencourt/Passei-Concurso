import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { ApostilaForm } from "@/components/admin/apostila-form"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export const dynamic = 'force-dynamic';

async function getSelectOptions() {
  const [categorias, orgaos, bancas, concursos] = await Promise.all([
    prisma.categoria.findMany({ where: { ativo: true }, orderBy: { nome: "asc" }, select: { id: true, nome: true } }),
    prisma.orgao.findMany({ orderBy: { nome: "asc" }, select: { id: true, nome: true } }),
    prisma.banca.findMany({ orderBy: { nome: "asc" }, select: { id: true, nome: true } }),
    prisma.concurso.findMany({ orderBy: { nome: "asc" }, select: { id: true, nome: true } }),
  ])
  return { categorias, orgaos, bancas, concursos }
}

export default async function NovaApostilaPage() {
  const session = await auth()
  if (!session?.user) redirect("/admin/login")

  const options = await getSelectOptions()

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link
          href="/admin/apostilas"
          className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Nova Apostila</h1>
          <p className="text-sm text-slate-500">Preencha os dados da nova apostila</p>
        </div>
      </div>

      <ApostilaForm
        categorias={options.categorias}
        orgaos={options.orgaos}
        bancas={options.bancas}
        concursos={options.concursos}
      />
    </div>
  )
}
