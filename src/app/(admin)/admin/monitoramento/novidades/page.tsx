"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ExternalLink, BookPlus, EyeOff, Search, Loader2, AlertCircle } from "lucide-react"
import { StatusBadge } from "@/components/admin/status-badge"
import { cn } from "@/lib/utils"
import { formatDistanceToNow } from "date-fns"
import { ptBR } from "date-fns/locale"

interface DetectedOpportunity {
  id: string
  urlOriginal: string
  nomeProvavel: string | null
  orgaoProvavel: string | null
  cargoProvavel: string | null
  categoriaProvavel: string | null
  estadoProvavel: string | null
  status: "NOVA" | "EM_ANALISE" | "CONVERTIDA" | "IGNORADA"
  createdAt: string
}

const STATUS_TABS = [
  { key: "", label: "Todas" },
  { key: "NOVA", label: "Novas" },
  { key: "EM_ANALISE", label: "Em Análise" },
  { key: "CONVERTIDA", label: "Convertidas" },
  { key: "IGNORADA", label: "Ignoradas" },
]

export default function NovidadesPage() {
  const router = useRouter()
  const [oportunidades, setOportunidades] = useState<DetectedOpportunity[]>([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState("NOVA")
  const [q, setQ] = useState("")
  const [actioning, setActioning] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  async function fetchOportunidades() {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (statusFilter) params.set("status", statusFilter)
      if (q) params.set("q", q)
      const res = await fetch(`/api/admin/monitoramento/novidades?${params}`)
      if (res.ok) setOportunidades(await res.json())
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchOportunidades() }, [statusFilter]) // eslint-disable-line

  async function updateStatus(id: string, newStatus: string) {
    setActioning(id)
    setError(null)
    try {
      const res = await fetch(`/api/admin/monitoramento/novidades/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      })
      if (!res.ok) throw new Error("Erro ao atualizar status.")
      await fetchOportunidades()
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erro inesperado.")
    } finally {
      setActioning(null)
    }
  }

  function converterEmApostila(op: DetectedOpportunity) {
    const params = new URLSearchParams()
    if (op.nomeProvavel) params.set("titulo", op.nomeProvavel)
    if (op.orgaoProvavel) params.set("orgao", op.orgaoProvavel)
    if (op.cargoProvavel) params.set("cargo", op.cargoProvavel)
    if (op.estadoProvavel) params.set("estado", op.estadoProvavel)
    params.set("opportunityId", op.id)
    router.push(`/admin/apostilas/nova?${params}`)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Novidades Detectadas</h1>
        <p className="text-sm text-slate-500">Oportunidades identificadas pelo monitoramento de sitemaps</p>
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">{error}</div>
      )}

      {/* Status tabs */}
      <div className="flex gap-1 overflow-x-auto rounded-xl border border-slate-200 bg-white p-1 shadow-sm">
        {STATUS_TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setStatusFilter(tab.key)}
            className={cn(
              "shrink-0 rounded-lg px-4 py-2 text-sm font-medium transition-colors",
              statusFilter === tab.key
                ? "bg-blue-600 text-white shadow-sm"
                : "text-slate-500 hover:bg-slate-100 hover:text-slate-700"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && fetchOportunidades()}
            placeholder="Buscar por nome, órgão, cargo..."
            className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-9 pr-3 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          />
        </div>
        <button
          onClick={fetchOportunidades}
          className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
        >
          Buscar
        </button>
      </div>

      {/* Cards */}
      {loading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="h-6 w-6 animate-spin text-slate-400" />
        </div>
      ) : oportunidades.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-slate-200 bg-white py-16 shadow-sm">
          <AlertCircle className="mb-2 h-8 w-8 text-slate-300" />
          <p className="text-slate-400">Nenhuma oportunidade encontrada.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {oportunidades.map((op) => (
            <div
              key={op.id}
              className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm hover:border-slate-300 transition-colors"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <StatusBadge status={op.status} />
                    <p className="font-semibold text-slate-800 truncate">
                      {op.nomeProvavel ?? "Sem nome identificado"}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-x-4 gap-y-0.5 text-xs text-slate-500">
                    {op.orgaoProvavel && <span>Órgão: <strong>{op.orgaoProvavel}</strong></span>}
                    {op.cargoProvavel && <span>Cargo: <strong>{op.cargoProvavel}</strong></span>}
                    {op.estadoProvavel && <span>Estado: <strong>{op.estadoProvavel}</strong></span>}
                    {op.categoriaProvavel && <span>Categoria: <strong>{op.categoriaProvavel}</strong></span>}
                  </div>
                  <div className="flex items-center gap-1 text-xs text-slate-400">
                    <a
                      href={op.urlOriginal}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 truncate hover:text-blue-600 transition-colors"
                    >
                      <ExternalLink className="h-3 w-3 shrink-0" />
                      <span className="truncate">{op.urlOriginal}</span>
                    </a>
                    <span className="shrink-0">
                      &mdash; {formatDistanceToNow(new Date(op.createdAt), { locale: ptBR, addSuffix: true })}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-wrap gap-2 shrink-0">
                  {op.status !== "CONVERTIDA" && (
                    <button
                      onClick={() => converterEmApostila(op)}
                      disabled={actioning === op.id}
                      className="flex items-center gap-1.5 rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-blue-500 transition-colors disabled:opacity-50"
                    >
                      <BookPlus className="h-3.5 w-3.5" />
                      Converter em Apostila
                    </button>
                  )}
                  {op.status === "NOVA" && (
                    <button
                      onClick={() => updateStatus(op.id, "EM_ANALISE")}
                      disabled={actioning === op.id}
                      className="rounded-lg border border-yellow-200 bg-yellow-50 px-3 py-1.5 text-xs font-medium text-yellow-700 hover:bg-yellow-100 transition-colors disabled:opacity-50"
                    >
                      Analisar
                    </button>
                  )}
                  {op.status !== "IGNORADA" && op.status !== "CONVERTIDA" && (
                    <button
                      onClick={() => updateStatus(op.id, "IGNORADA")}
                      disabled={actioning === op.id}
                      className="flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-500 hover:bg-slate-50 transition-colors disabled:opacity-50"
                    >
                      {actioning === op.id
                        ? <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        : <EyeOff className="h-3.5 w-3.5" />
                      }
                      Ignorar
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
