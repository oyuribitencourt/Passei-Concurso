import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import Link from "next/link"
import { StatusBadge } from "@/components/admin/status-badge"
import { DeleteApostilaButton } from "@/components/admin/delete-apostila-button"
import { Plus, Search, ExternalLink, Pencil, CheckCircle2, XCircle } from "lucide-react"

export const dynamic = 'force-dynamic';

interface ApostilasPageProps {
  searchParams: Promise<{
    q?: string
    status?: string
    page?: string
  }>
}

const PER_PAGE = 20

export default async function ApostilasPage({ searchParams }: ApostilasPageProps) {
  const session = await auth()
  if (!session?.user) redirect("/admin/login")

  const params = await searchParams
  const q = params.q?.trim() ?? ""
  const statusFilter = params.status ?? ""
  const page = Math.max(1, Number(params.page ?? 1))

  const where = {
    ...(q
      ? {
          OR: [
            { titulo: { contains: q, mode: "insensitive" as const } },
            { slug: { contains: q, mode: "insensitive" as const } },
          ],
        }
      : {}),
    ...(statusFilter ? { status: statusFilter as never } : {}),
  }

  const [apostilas, total] = await Promise.all([
    prisma.apostila.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * PER_PAGE,
      take: PER_PAGE,
      include: { categoria: true },
    }),
    prisma.apostila.count({ where }),
  ])

  const totalPages = Math.ceil(total / PER_PAGE)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Apostilas</h1>
          <p className="text-sm text-slate-500">{total} apostila(s) encontrada(s)</p>
        </div>
        <Link
          href="/admin/apostilas/nova"
          className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-500 transition-colors"
        >
          <Plus className="h-4 w-4" />
          Nova Apostila
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <form method="get" className="flex flex-1 flex-wrap gap-3">
          <div className="relative flex-1 min-w-48">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              name="q"
              defaultValue={q}
              placeholder="Buscar por título ou slug..."
              className="w-full rounded-lg border border-slate-200 py-2 pl-9 pr-3 text-sm text-slate-800 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>
          <select
            name="status"
            defaultValue={statusFilter}
            className="rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700 outline-none focus:border-blue-500"
          >
            <option value="">Todos os status</option>
            <option value="RASCUNHO">Rascunho</option>
            <option value="PUBLICADO">Publicado</option>
            <option value="PAUSADO">Pausado</option>
            <option value="PENDENTE_REVISAO">Pendente Revisão</option>
          </select>
          <button
            type="submit"
            className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
          >
            Filtrar
          </button>
          {(q || statusFilter) && (
            <Link
              href="/admin/apostilas"
              className="rounded-lg px-4 py-2 text-sm text-slate-400 hover:text-slate-600 transition-colors"
            >
              Limpar
            </Link>
          )}
        </form>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50">
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Título</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Categoria</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Status</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Link Ticto</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Data</th>
              <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">Ações</th>
            </tr>
          </thead>
          <tbody>
            {apostilas.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-12 text-center text-slate-400">
                  Nenhuma apostila encontrada.
                </td>
              </tr>
            ) : (
              apostilas.map((a) => (
                <tr key={a.id} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/60 transition-colors">
                  <td className="px-4 py-3">
                    <div className="max-w-xs">
                      <p className="font-medium text-slate-800 truncate">{a.titulo}</p>
                      <p className="text-xs text-slate-400 truncate">{a.slug}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-slate-600">
                    {a.categoria?.nome ?? <span className="text-slate-300">-</span>}
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={a.status} />
                  </td>
                  <td className="px-4 py-3">
                    {a.linkCheckoutTicto ? (
                      <span className="flex items-center gap-1 text-green-600">
                        <CheckCircle2 className="h-4 w-4" />
                        <span className="text-xs">Sim</span>
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-slate-300">
                        <XCircle className="h-4 w-4" />
                        <span className="text-xs">Não</span>
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-xs text-slate-500 whitespace-nowrap">
                    {a.createdAt.toLocaleDateString("pt-BR")}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <Link
                        href={`/apostilas/${a.slug}`}
                        target="_blank"
                        className="rounded-md p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
                        title="Ver no site"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </Link>
                      <Link
                        href={`/admin/apostilas/${a.id}`}
                        className="rounded-md p-1.5 text-slate-400 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                        title="Editar"
                      >
                        <Pencil className="h-4 w-4" />
                      </Link>
                      <DeleteApostilaButton id={a.id} titulo={a.titulo} />
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between px-1">
          <p className="text-xs text-slate-500">
            Página {page} de {totalPages} &mdash; {total} resultados
          </p>
          <div className="flex gap-1">
            {page > 1 && (
              <Link
                href={`/admin/apostilas?q=${q}&status=${statusFilter}&page=${page - 1}`}
                className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-100 transition-colors"
              >
                Anterior
              </Link>
            )}
            {page < totalPages && (
              <Link
                href={`/admin/apostilas?q=${q}&status=${statusFilter}&page=${page + 1}`}
                className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-100 transition-colors"
              >
                Próximo
              </Link>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

