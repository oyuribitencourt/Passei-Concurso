import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import Link from "next/link"
import { StatusBadge } from "@/components/admin/status-badge"
import { Plus, Search, Pencil } from "lucide-react"

export const dynamic = 'force-dynamic';

interface ConcursosPageProps {
  searchParams: Promise<{ q?: string; status?: string; page?: string }>
}

const PER_PAGE = 20

export default async function ConcursosPage({ searchParams }: ConcursosPageProps) {
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
            { nome: { contains: q, mode: "insensitive" as const } },
            { slug: { contains: q, mode: "insensitive" as const } },
          ],
        }
      : {}),
    ...(statusFilter ? { status: statusFilter as never } : {}),
  }

  const [concursos, total] = await Promise.all([
    prisma.concurso.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * PER_PAGE,
      take: PER_PAGE,
      include: {
        orgao: { select: { nome: true, sigla: true } },
        banca: { select: { nome: true } },
        _count: { select: { apostilas: true } },
      },
    }),
    prisma.concurso.count({ where }),
  ])

  const totalPages = Math.ceil(total / PER_PAGE)

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Concursos</h1>
          <p className="text-sm text-slate-500">{total} concurso(s) encontrado(s)</p>
        </div>
        <Link
          href="/admin/concursos/novo"
          className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-500 transition-colors"
        >
          <Plus className="h-4 w-4" />
          Novo Concurso
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
              placeholder="Buscar por nome..."
              className="w-full rounded-lg border border-slate-200 py-2 pl-9 pr-3 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>
          <select
            name="status"
            defaultValue={statusFilter}
            className="rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-500"
          >
            <option value="">Todos os status</option>
            <option value="ABERTO">Aberto</option>
            <option value="EM_ANDAMENTO">Em Andamento</option>
            <option value="ENCERRADO">Encerrado</option>
            <option value="PREVISTO">Previsto</option>
            <option value="ANULADO">Anulado</option>
          </select>
          <button type="submit" className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors">
            Filtrar
          </button>
          {(q || statusFilter) && (
            <Link href="/admin/concursos" className="rounded-lg px-4 py-2 text-sm text-slate-400 hover:text-slate-600">
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
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Nome</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Órgão</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Banca</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Estado</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Status</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Apostilas</th>
              <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">Ações</th>
            </tr>
          </thead>
          <tbody>
            {concursos.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-12 text-center text-slate-400">Nenhum concurso encontrado.</td>
              </tr>
            ) : (
              concursos.map((c) => (
                <tr key={c.id} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/60 transition-colors">
                  <td className="px-4 py-3">
                    <p className="font-medium text-slate-800">{c.nome}</p>
                    <p className="text-xs text-slate-400">{c.ano ?? "-"}</p>
                  </td>
                  <td className="px-4 py-3 text-slate-600">
                    {c.orgao ? (c.orgao.sigla ?? c.orgao.nome) : <span className="text-slate-300">-</span>}
                  </td>
                  <td className="px-4 py-3 text-slate-600">
                    {c.banca?.nome ?? <span className="text-slate-300">-</span>}
                  </td>
                  <td className="px-4 py-3 text-slate-600">{c.estado ?? <span className="text-slate-300">-</span>}</td>
                  <td className="px-4 py-3"><StatusBadge status={c.status} /></td>
                  <td className="px-4 py-3 text-slate-600">{c._count.apostilas}</td>
                  <td className="px-4 py-3 text-right">
                    <Link
                      href={`/admin/concursos/${c.id}`}
                      className="inline-flex items-center rounded-md p-1.5 text-slate-400 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                    >
                      <Pencil className="h-4 w-4" />
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between px-1">
          <p className="text-xs text-slate-500">Página {page} de {totalPages}</p>
          <div className="flex gap-1">
            {page > 1 && (
              <Link href={`/admin/concursos?q=${q}&status=${statusFilter}&page=${page - 1}`} className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-100">Anterior</Link>
            )}
            {page < totalPages && (
              <Link href={`/admin/concursos?q=${q}&status=${statusFilter}&page=${page + 1}`} className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-100">Próximo</Link>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
