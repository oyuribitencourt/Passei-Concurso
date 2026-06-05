import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { StatCard } from "@/components/admin/stat-card"
import { StatusBadge } from "@/components/admin/status-badge"
import { DashboardCharts } from "@/components/admin/dashboard-charts"
import {
  BookOpen,
  CheckCircle,
  FileText,
  Trophy,
  Sparkles,
  Link2Off,
} from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { ptBR } from "date-fns/locale"

export const dynamic = 'force-dynamic';

async function getDashboardData() {
  const [
    totalApostilas,
    publicadas,
    rascunhos,
    totalConcursos,
    oportunidadesNovas,
    semLinkTicto,
    apostilasPorCategoria,
    recentApostilas,
    recentOportunidades,
    oportunidadesPorDia,
    pendentesRevisao,
  ] = await Promise.all([
    prisma.apostila.count(),
    prisma.apostila.count({ where: { status: "PUBLICADO" } }),
    prisma.apostila.count({ where: { status: "RASCUNHO" } }),
    prisma.concurso.count(),
    prisma.detectedOpportunity.count({ where: { status: "NOVA" } }),
    prisma.apostila.count({
      where: { status: "PUBLICADO", linkCheckoutTicto: null },
    }),
    prisma.apostila.groupBy({
      by: ["categoriaId"],
      _count: { id: true },
      orderBy: { _count: { id: "desc" } },
      take: 8,
    }),
    prisma.apostila.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
      include: { categoria: true },
    }),
    prisma.detectedOpportunity.findMany({
      where: { status: "NOVA" },
      orderBy: { createdAt: "desc" },
      take: 5,
    }),
    prisma.detectedOpportunity.findMany({
      where: {
        createdAt: {
          gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        },
      },
      select: { createdAt: true },
      orderBy: { createdAt: "asc" },
    }),
    prisma.apostila.findMany({
      where: { status: "PENDENTE_REVISAO" },
      orderBy: { updatedAt: "desc" },
      take: 5,
      include: { categoria: true },
    }),
  ])

  // Resolve category names for the chart
  const categoriaIds = apostilasPorCategoria
    .map((g) => g.categoriaId)
    .filter(Boolean) as string[]

  const categorias = await prisma.categoria.findMany({
    where: { id: { in: categoriaIds } },
    select: { id: true, nome: true },
  })

  const categoriaMap = Object.fromEntries(categorias.map((c) => [c.id, c.nome]))

  const chartCategorias = apostilasPorCategoria.map((g) => ({
    categoria: g.categoriaId ? (categoriaMap[g.categoriaId] ?? "Sem categoria") : "Sem categoria",
    total: g._count.id,
  }))

  // Group opportunities by day (last 30 days) - aggregate in JS
  const grouped: Record<string, number> = {}

  for (const op of oportunidadesPorDia) {
    const key = new Date(op.createdAt).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
    })
    grouped[key] = (grouped[key] ?? 0) + 1
  }

  const oportunidadesDiarias = Object.entries(grouped).map(([data, total]) => ({
    data,
    total,
  }))

  return {
    totalApostilas,
    publicadas,
    rascunhos,
    totalConcursos,
    oportunidadesNovas,
    semLinkTicto,
    chartCategorias,
    recentApostilas,
    recentOportunidades,
    oportunidadesDiarias,
    pendentesRevisao,
  }
}

export default async function DashboardPage() {
  const session = await auth()
  if (!session?.user) redirect("/admin/login")

  const data = await getDashboardData()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
        <p className="text-sm text-slate-500">
          Bem-vindo ao painel administrativo, {session.user.name}.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-6">
        <StatCard
          titulo="Total Apostilas"
          valor={data.totalApostilas}
          icon={BookOpen}
          cor="azul"
        />
        <StatCard
          titulo="Publicadas"
          valor={data.publicadas}
          icon={CheckCircle}
          cor="verde"
        />
        <StatCard
          titulo="Rascunho"
          valor={data.rascunhos}
          icon={FileText}
          cor="slate"
        />
        <StatCard
          titulo="Total Concursos"
          valor={data.totalConcursos}
          icon={Trophy}
          cor="roxo"
        />
        <StatCard
          titulo="Oportunidades Novas"
          valor={data.oportunidadesNovas}
          icon={Sparkles}
          cor="amarelo"
        />
        <StatCard
          titulo="Sem Link Ticto"
          valor={data.semLinkTicto}
          icon={Link2Off}
          cor="vermelho"
        />
      </div>

      {/* Charts */}
      <DashboardCharts
        apostilasPorCategoria={data.chartCategorias}
        oportunidadesPorDia={data.oportunidadesDiarias}
      />

      {/* Bottom panels */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 xl:grid-cols-3">
        {/* Atividade recente */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="mb-4 text-sm font-semibold text-slate-700">
            Apostilas Recentes
          </h3>
          {data.recentApostilas.length === 0 ? (
            <p className="text-sm text-slate-400">Nenhuma apostila criada.</p>
          ) : (
            <ul className="space-y-3">
              {data.recentApostilas.map((a) => (
                <li key={a.id} className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-slate-800">
                      {a.titulo}
                    </p>
                    <p className="text-xs text-slate-400">
                      {formatDistanceToNow(a.createdAt, {
                        locale: ptBR,
                        addSuffix: true,
                      })}
                    </p>
                  </div>
                  <StatusBadge status={a.status} />
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Oportunidades novas */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="mb-4 text-sm font-semibold text-slate-700">
            Novas Oportunidades
          </h3>
          {data.recentOportunidades.length === 0 ? (
            <p className="text-sm text-slate-400">Nenhuma oportunidade nova.</p>
          ) : (
            <ul className="space-y-3">
              {data.recentOportunidades.map((op) => (
                <li key={op.id} className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-slate-800">
                      {op.nomeProvavel ?? "Sem nome identificado"}
                    </p>
                    <p className="truncate text-xs text-slate-400">
                      {op.orgaoProvavel ?? op.urlOriginal}
                    </p>
                  </div>
                  <StatusBadge status={op.status} />
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Pendentes revisao */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="mb-4 text-sm font-semibold text-slate-700">
            Pendentes de Revisão
          </h3>
          {data.pendentesRevisao.length === 0 ? (
            <p className="text-sm text-slate-400">Nenhum item pendente.</p>
          ) : (
            <ul className="space-y-3">
              {data.pendentesRevisao.map((a) => (
                <li key={a.id} className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-slate-800">
                      {a.titulo}
                    </p>
                    <p className="text-xs text-slate-400">
                      {a.categoria?.nome ?? "Sem categoria"}
                    </p>
                  </div>
                  <StatusBadge status={a.status} />
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}
