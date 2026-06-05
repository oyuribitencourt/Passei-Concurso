import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { redirect, notFound } from "next/navigation"
import { ApostilaForm } from "@/components/admin/apostila-form"
import { ArrowLeft, ExternalLink } from "lucide-react"
import Link from "next/link"

export const dynamic = 'force-dynamic';

interface EditApostilaPageProps {
  params: Promise<{ id: string }>
}

async function getSelectOptions() {
  const [categorias, orgaos, bancas, concursos] = await Promise.all([
    prisma.categoria.findMany({ where: { ativo: true }, orderBy: { nome: "asc" }, select: { id: true, nome: true } }),
    prisma.orgao.findMany({ orderBy: { nome: "asc" }, select: { id: true, nome: true } }),
    prisma.banca.findMany({ orderBy: { nome: "asc" }, select: { id: true, nome: true } }),
    prisma.concurso.findMany({ orderBy: { nome: "asc" }, select: { id: true, nome: true } }),
  ])
  return { categorias, orgaos, bancas, concursos }
}

export default async function EditApostilaPage({ params }: EditApostilaPageProps) {
  const session = await auth()
  if (!session?.user) redirect("/admin/login")

  const { id } = await params

  const [apostila, options] = await Promise.all([
    prisma.apostila.findUnique({ where: { id } }),
    getSelectOptions(),
  ])

  if (!apostila) notFound()

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/apostilas"
            className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="text-xl font-bold text-slate-900 line-clamp-1">{apostila.titulo}</h1>
            <p className="text-sm text-slate-500">Editando apostila</p>
          </div>
        </div>
        <Link
          href={`/apostilas/${apostila.slug}`}
          target="_blank"
          className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600 hover:bg-slate-50 transition-colors"
        >
          <ExternalLink className="h-4 w-4" />
          Ver no site
        </Link>
      </div>

      <ApostilaForm
        initialData={{
          id: apostila.id,
          titulo: apostila.titulo,
          slug: apostila.slug,
          descricaoCurta: apostila.descricaoCurta,
          descricaoLonga: apostila.descricaoLonga,
          orgaoId: apostila.orgaoId,
          cargo: apostila.cargo,
          bancaId: apostila.bancaId,
          estado: apostila.estado,
          cidade: apostila.cidade,
          nivel: apostila.nivel,
          area: apostila.area,
          categoriaId: apostila.categoriaId,
          statusConcurso: apostila.statusConcurso,
          ano: apostila.ano,
          conteudoProgramatico: apostila.conteudoProgramatico,
          beneficios: apostila.beneficios,
          publicoAlvo: apostila.publicoAlvo,
          faq: apostila.faq,
          imagemCapa: apostila.imagemCapa,
          linkCheckoutTicto: apostila.linkCheckoutTicto,
          idProdutoTicto: apostila.idProdutoTicto,
          precoExibido: apostila.precoExibido ? Number(apostila.precoExibido) : null,
          status: apostila.status,
          seoTitle: apostila.seoTitle,
          seoDescription: apostila.seoDescription,
          keywords: apostila.keywords,
          canonicalUrl: apostila.canonicalUrl,
          concursoId: apostila.concursoId,
        }}
        categorias={options.categorias}
        orgaos={options.orgaos}
        bancas={options.bancas}
        concursos={options.concursos}
      />
    </div>
  )
}
