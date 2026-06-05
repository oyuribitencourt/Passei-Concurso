"use client"

import { useState, useEffect } from "react"
import { Plus, ToggleLeft, ToggleRight, RefreshCw, Loader2, Globe, CheckCircle2, XCircle, AlertCircle } from "lucide-react"
import { cn } from "@/lib/utils"
import { formatDistanceToNow } from "date-fns"
import { ptBR } from "date-fns/locale"

interface SitemapSource {
  id: string
  nome: string
  url: string
  ativo: boolean
  intervaloHoras: number
  ultimaVerificacao: string | null
  ultimoStatus: string | null
  totalUrlsEncontradas: number
}

export default function FontesPage() {
  const [fontes, setFontes] = useState<SitemapSource[]>([])
  const [loading, setLoading] = useState(true)
  const [checking, setChecking] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  // Form state
  const [newNome, setNewNome] = useState("")
  const [newUrl, setNewUrl] = useState("")
  const [newIntervalo, setNewIntervalo] = useState(24)
  const [creating, setCreating] = useState(false)

  async function fetchFontes() {
    try {
      const res = await fetch("/api/admin/monitoramento/fontes?limit=100")
      if (res.ok) {
        const json = await res.json()
        // API returns { data, pagination } shape
        setFontes(Array.isArray(json) ? json : (json.data ?? []))
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchFontes() }, [])

  async function toggleAtivo(id: string, ativo: boolean) {
    try {
      await fetch(`/api/admin/monitoramento/fontes/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ativo: !ativo }),
      })
      await fetchFontes()
    } catch {
      setError("Erro ao alterar status.")
    }
  }

  async function executarVerificacao(id: string) {
    setChecking(id)
    setError(null)
    setSuccess(null)
    try {
      const res = await fetch("/api/admin/monitoramento/executar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sourceId: id }),
      })
      if (!res.ok) throw new Error("Erro ao executar verificação.")
      setSuccess("Verificação iniciada com sucesso.")
      setTimeout(() => fetchFontes(), 2000)
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erro inesperado.")
    } finally {
      setChecking(null)
    }
  }

  async function createFonte() {
    if (!newNome.trim() || !newUrl.trim()) return
    setCreating(true)
    setError(null)
    try {
      const res = await fetch("/api/admin/monitoramento/fontes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nome: newNome.trim(), url: newUrl.trim(), intervaloHoras: newIntervalo }),
      })
      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err.error ?? "Erro ao criar fonte.")
      }
      setNewNome("")
      setNewUrl("")
      setNewIntervalo(24)
      await fetchFontes()
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erro ao criar fonte.")
    } finally {
      setCreating(false)
    }
  }

  const inputClass = "rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"

  function StatusIcon({ status }: { status: string | null }) {
    if (!status) return <span className="text-slate-300">-</span>
    if (status === "ok" || status === "SUCESSO") return <CheckCircle2 className="h-4 w-4 text-green-500" />
    if (status === "ERRO") return <XCircle className="h-4 w-4 text-red-500" />
    return <AlertCircle className="h-4 w-4 text-yellow-500" />
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Fontes de Monitoramento</h1>
        <p className="text-sm text-slate-500">Gerencie os sitemaps monitorados para detectar novas oportunidades</p>
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">{error}</div>
      )}
      {success && (
        <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">{success}</div>
      )}

      {/* Create form */}
      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="mb-4 flex items-center gap-2 text-sm font-semibold text-slate-700">
          <Globe className="h-4 w-4" />
          Adicionar Nova Fonte
        </h2>
        <div className="flex flex-wrap gap-3">
          <input
            value={newNome}
            onChange={(e) => setNewNome(e.target.value)}
            placeholder="Nome da fonte (ex: Concurso Público)"
            className={cn(inputClass, "flex-1 min-w-48")}
          />
          <input
            value={newUrl}
            onChange={(e) => setNewUrl(e.target.value)}
            placeholder="URL do sitemap (https://...)"
            className={cn(inputClass, "flex-1 min-w-64")}
          />
          <div className="flex items-center gap-2">
            <label className="text-xs text-slate-500 whitespace-nowrap">Intervalo (h):</label>
            <input
              type="number"
              value={newIntervalo}
              onChange={(e) => setNewIntervalo(Number(e.target.value))}
              min={1}
              max={168}
              className={cn(inputClass, "w-16")}
            />
          </div>
          <button
            onClick={createFonte}
            disabled={creating || !newNome.trim() || !newUrl.trim()}
            className="flex items-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-500 transition-colors disabled:opacity-50"
          >
            {creating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
            Adicionar
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50">
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Nome / URL</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Status</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Última Verificação</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">URLs Encontradas</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Intervalo</th>
              <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">Ações</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} className="px-4 py-12 text-center">
                  <Loader2 className="mx-auto h-5 w-5 animate-spin text-slate-400" />
                </td>
              </tr>
            ) : fontes.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-12 text-center text-slate-400">Nenhuma fonte cadastrada.</td>
              </tr>
            ) : (
              fontes.map((fonte) => (
                <tr key={fonte.id} className={cn("border-b border-slate-50 last:border-0 hover:bg-slate-50/60 transition-colors", !fonte.ativo && "opacity-60")}>
                  <td className="px-4 py-3">
                    <p className="font-medium text-slate-800">{fonte.nome}</p>
                    <p className="text-xs text-slate-400 truncate max-w-xs">{fonte.url}</p>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5">
                      <StatusIcon status={fonte.ultimoStatus} />
                      <span className="text-xs text-slate-500">{fonte.ultimoStatus ?? "Nunca verificado"}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-xs text-slate-500">
                    {fonte.ultimaVerificacao
                      ? formatDistanceToNow(new Date(fonte.ultimaVerificacao), { locale: ptBR, addSuffix: true })
                      : "Nunca"}
                  </td>
                  <td className="px-4 py-3 text-slate-700 font-medium">{fonte.totalUrlsEncontradas}</td>
                  <td className="px-4 py-3 text-slate-500">{fonte.intervaloHoras}h</td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => executarVerificacao(fonte.id)}
                        disabled={checking === fonte.id}
                        className="rounded-md p-1.5 text-slate-400 hover:bg-blue-50 hover:text-blue-600 transition-colors disabled:opacity-50"
                        title="Verificar agora"
                      >
                        {checking === fonte.id
                          ? <Loader2 className="h-4 w-4 animate-spin" />
                          : <RefreshCw className="h-4 w-4" />
                        }
                      </button>
                      <button
                        onClick={() => toggleAtivo(fonte.id, fonte.ativo)}
                        className={cn(
                          "rounded-md p-1.5 transition-colors",
                          fonte.ativo ? "text-green-500 hover:bg-green-50" : "text-slate-300 hover:bg-slate-100"
                        )}
                        title={fonte.ativo ? "Desativar" : "Ativar"}
                      >
                        {fonte.ativo ? <ToggleRight className="h-5 w-5" /> : <ToggleLeft className="h-5 w-5" />}
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
