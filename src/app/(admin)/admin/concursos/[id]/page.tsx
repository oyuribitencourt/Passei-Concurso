import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { redirect, notFound } from "next/navigation"
import { ConcursoForm } from "@/components/admin/concurso-form"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export const dynamic = 'force-dynamic';

interface EditConcursoPageProps {
  params: Promise<{ id: string }>
}

export default async function EditConcursoPage({ params }: EditConcursoPageProps) {
  const session = await auth()
  if (!session?.user) redirect("/admin/login")

  const { id } = await params

  const [concurso, orgaos, bancas] = await Promise.all([
    prisma.concurso.findUnique({ where: { id } }),
    prisma.orgao.findMany({ orderBy: { nome: "asc" }, select: { id: true, nome: true } }),
    prisma.banca.findMany({ orderBy: { nome: "asc" }, select: { id: true, nome: true } }),
  ])

  if (!concurso) notFound()

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/admin/concursos" className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-xl font-bold text-slate-900 line-clamp-1">{concurso.nome}</h1>
          <p className="text-sm text-slate-500">Editando concurso</p>
        </div>
      </div>
      <ConcursoForm
        initialData={{
          id: concurso.id,
          nome: concurso.nome,
          slug: concurso.slug,
          orgaoId: concurso.orgaoId,
          bancaId: concurso.bancaId,
          estado: concurso.estado,
          cidade: concurso.cidade,
          cargos: concurso.cargos,
          nivel: concurso.nivel,
          area: concurso.area,
          status: concurso.status,
          ano: concurso.ano,
          linkReferencia: concurso.linkReferencia,
          observacoes: concurso.observacoes,
        }}
        orgaos={orgaos}
        bancas={bancas}
      />
    </div>
  )
}
