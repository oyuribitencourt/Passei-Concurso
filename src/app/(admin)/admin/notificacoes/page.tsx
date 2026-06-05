"use client"

import { useState, useEffect } from "react"
import { Bell, CheckCheck, ExternalLink, Loader2 } from "lucide-react"
import { StatusBadge } from "@/components/admin/status-badge"
import { cn } from "@/lib/utils"
import { formatDistanceToNow } from "date-fns"
import { ptBR } from "date-fns/locale"

interface Notificacao {
  id: string
  tipo: string
  titulo: string
  mensagem: string
  lida: boolean
  link: string | null
  createdAt: string
}

const TIPO_TABS = [
  { key: "", label: "Todas" },
  { key: "NOVA_URL", label: "Nova URL" },
  { key: "FONTE_FALHOU", label: "Falhas" },
  { key: "SEM_LINK_TICTO", label: "Sem Ticto" },
  { key: "OPORTUNIDADE_CONVERTIDA", label: "Convertidas" },
  { key: "SISTEMA", label: "Sistema" },
]

export default function NotificacoesPage() {
  const [notificacoes, setNotificacoes] = useState<Notificacao[]>([])
  const [loading, setLoading] = useState(true)
  const [tipoFilter, setTipoFilter] = useState("")
  const [apenasNaoLidas, setApenasNaoLidas] = useState(false)
  const [marking, setMarking] = useState<string | null>(null)
  const [markingAll, setMarkingAll] = useState(false)

  async function fetchNotificacoes() {
    setLoading(true)
    try {
      const params = new URLSearchParams({ limit: "50" })
      if (apenasNaoLidas) params.set("lida", "false")
      const res = await fetch(`/api/admin/notificacoes?${params}`)
      if (res.ok) {
        const json = await res.json()
        const all: Notificacao[] = Array.isArray(json) ? json : (json.data ?? [])
        // Filter by tipo client-side since the API doesn't support it
        setNotificacoes(tipoFilter ? all.filter((n) => n.tipo === tipoFilter) : all)
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchNotificacoes() }, [tipoFilter, apenasNaoLidas]) // eslint-disable-line

  async function marcarLida(id: string) {
    setMarking(id)
    try {
      await fetch(`/api/admin/notificacoes/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lida: true }),
      })
      setNotificacoes((prev) =>
        prev.map((n) => (n.id === id ? { ...n, lida: true } : n))
      )
    } finally {
      setMarking(null)
    }
  }

  async function marcarTodasLidas() {
    setMarkingAll(true)
    try {
      await fetch("/api/admin/notificacoes", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ marcarTodasLidas: true }),
      })
      setNotificacoes((prev) => prev.map((n) => ({ ...n, lida: true })))
    } finally {
      setMarkingAll(false)
    }
  }

  const naoLidasCount = notificacoes.filter((n) => !n.lida).length

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Notificações</h1>
          <p className="text-sm text-slate-500">
            {naoLidasCount > 0
              ? `${naoLidasCount} não lida(s)`
              : "Todas as notificações foram lidas"}
          </p>
        </div>
        {naoLidasCount > 0 && (
          <button
            onClick={marcarTodasLidas}
            disabled={markingAll}
            className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
          >
            {markingAll ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCheck className="h-4 w-4" />}
            Marcar todas como lidas
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex gap-1 overflow-x-auto rounded-xl border border-slate-200 bg-white p-1 shadow-sm">
          {TIPO_TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setTipoFilter(tab.key)}
              className={cn(
                "shrink-0 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors",
                tipoFilter === tab.key
                  ? "bg-blue-600 text-white shadow-sm"
                  : "text-slate-500 hover:bg-slate-100 hover:text-slate-700"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <label className="flex items-center gap-2 text-sm text-slate-600 cursor-pointer">
          <input
            type="checkbox"
            checked={apenasNaoLidas}
            onChange={(e) => setApenasNaoLidas(e.target.checked)}
            className="rounded border-slate-300"
          />
          Apenas não lidas
        </label>
      </div>

      {/* List */}
      {loading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="h-6 w-6 animate-spin text-slate-400" />
        </div>
      ) : notificacoes.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-slate-200 bg-white py-16 shadow-sm">
          <Bell className="mb-2 h-8 w-8 text-slate-300" />
          <p className="text-slate-400">Nenhuma notificação encontrada.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {notificacoes.map((n) => (
            <div
              key={n.id}
              className={cn(
                "rounded-xl border bg-white p-4 shadow-sm transition-colors",
                n.lida ? "border-slate-200 opacity-70" : "border-blue-200 bg-blue-50/30"
              )}
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    {!n.lida && (
                      <span className="h-2 w-2 rounded-full bg-blue-500 shrink-0" />
                    )}
                    <StatusBadge status={n.tipo} />
                    <p className="font-semibold text-slate-800">{n.titulo}</p>
                  </div>
                  <p className="text-sm text-slate-600">{n.mensagem}</p>
                  <p className="text-xs text-slate-400">
                    {formatDistanceToNow(new Date(n.createdAt), { locale: ptBR, addSuffix: true })}
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  {n.link && (
                    <a
                      href={n.link}
                      className="rounded-md p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
                      title="Ver item relacionado"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  )}
                  {!n.lida && (
                    <button
                      onClick={() => marcarLida(n.id)}
                      disabled={marking === n.id}
                      className="rounded-md p-1.5 text-blue-500 hover:bg-blue-50 transition-colors disabled:opacity-50"
                      title="Marcar como lida"
                    >
                      {marking === n.id
                        ? <Loader2 className="h-4 w-4 animate-spin" />
                        : <CheckCheck className="h-4 w-4" />
                      }
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
