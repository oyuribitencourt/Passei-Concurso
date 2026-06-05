"use client"

import { useState, useEffect } from "react"
import { Save, Loader2, Plug, ToggleLeft, ToggleRight, TestTube2 } from "lucide-react"
import { StatusBadge } from "@/components/admin/status-badge"
import { cn } from "@/lib/utils"
import { formatDistanceToNow } from "date-fns"
import { ptBR } from "date-fns/locale"

interface TictoConfig {
  id: string
  apiKey: string | null
  webhookSecret: string | null
  urlBase: string | null
  ativo: boolean
}

interface WebhookLog {
  id: string
  evento: string
  status: string
  ip: string | null
  createdAt: string
}

export default function TictoPage() {
  const [config, setConfig] = useState<TictoConfig | null>(null)
  const [logs, setLogs] = useState<WebhookLog[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [testing, setTesting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const [apiKey, setApiKey] = useState("")
  const [webhookSecret, setWebhookSecret] = useState("")
  const [urlBase, setUrlBase] = useState("")
  const [ativo, setAtivo] = useState(false)

  useEffect(() => {
    async function fetchConfig() {
      try {
        const [configRes, logsRes] = await Promise.all([
          fetch("/api/admin/configuracoes/ticto"),
          fetch("/api/admin/configuracoes/ticto/logs").catch(() => null),
        ])
        if (configRes.ok) {
          const data = await configRes.json()
          setConfig(data)
          setApiKey(data.apiKey ?? "")
          setWebhookSecret(data.webhookSecret ?? "")
          setUrlBase(data.urlBase ?? "")
          setAtivo(data.ativo ?? false)
        }
        if (logsRes?.ok) {
          const logsData = await logsRes.json()
          setLogs(Array.isArray(logsData) ? logsData : (logsData.data ?? []))
        }
      } finally {
        setLoading(false)
      }
    }
    fetchConfig()
  }, [])

  async function handleSave() {
    setSaving(true)
    setError(null)
    setSuccess(null)
    try {
      const res = await fetch("/api/admin/configuracoes/ticto", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ apiKey: apiKey || null, webhookSecret: webhookSecret || null, urlBase: urlBase || null, ativo }),
      })
      if (!res.ok) throw new Error("Erro ao salvar configurações.")
      setSuccess("Configurações salvas com sucesso.")
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erro inesperado.")
    } finally {
      setSaving(false)
    }
  }

  async function handleTest() {
    setTesting(true)
    setError(null)
    setSuccess(null)
    // Placeholder: no real test endpoint yet
    await new Promise((r) => setTimeout(r, 1500))
    setSuccess("Funcionalidade de teste em desenvolvimento.")
    setTesting(false)
  }

  const inputClass = "w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-800 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition font-mono"
  const labelClass = "mb-1.5 block text-sm font-medium text-slate-700"

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Integração Ticto</h1>
        <p className="text-sm text-slate-500">Configure a integração com a plataforma de checkout Ticto</p>
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">{error}</div>
      )}
      {success && (
        <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">{success}</div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="h-6 w-6 animate-spin text-slate-400" />
        </div>
      ) : (
        <>
          {/* Config form */}
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                <Plug className="h-4 w-4" />
                Credenciais e Configurações
              </h2>
              <button
                onClick={() => setAtivo((v) => !v)}
                className={cn(
                  "flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors",
                  ativo
                    ? "bg-green-50 text-green-700 hover:bg-green-100"
                    : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                )}
              >
                {ativo ? <ToggleRight className="h-4 w-4" /> : <ToggleLeft className="h-4 w-4" />}
                {ativo ? "Ativo" : "Inativo"}
              </button>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className={labelClass}>URL Base da API</label>
                <input
                  value={urlBase}
                  onChange={(e) => setUrlBase(e.target.value)}
                  placeholder="https://api.ticto.app"
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>API Key</label>
                <input
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="tk_live_••••••••••••"
                  type="password"
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Webhook Secret</label>
                <input
                  value={webhookSecret}
                  onChange={(e) => setWebhookSecret(e.target.value)}
                  placeholder="whsec_••••••••••••"
                  type="password"
                  className={inputClass}
                />
              </div>
            </div>

            <div className="mt-5 flex flex-wrap gap-3">
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex items-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-500 transition-colors disabled:opacity-50"
              >
                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                Salvar Configurações
              </button>
              <button
                onClick={handleTest}
                disabled={testing || !apiKey}
                className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors disabled:opacity-50"
              >
                {testing ? <Loader2 className="h-4 w-4 animate-spin" /> : <TestTube2 className="h-4 w-4" />}
                Testar Conexão
              </button>
            </div>
          </div>

          {/* Info box */}
          <div className="rounded-xl border border-blue-100 bg-blue-50 p-4">
            <p className="text-sm font-medium text-blue-800">Endpoint de Webhook</p>
            <p className="mt-1 font-mono text-sm text-blue-700">
              {typeof window !== "undefined" ? window.location.origin : "https://seu-dominio.com.br"}
              /api/webhooks/ticto
            </p>
            <p className="mt-2 text-xs text-blue-600">
              Configure este endpoint no painel da Ticto para receber notificações de compra.
            </p>
          </div>

          {/* Webhook logs */}
          <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-100 px-5 py-4">
              <h2 className="text-sm font-semibold text-slate-700">Logs de Webhook Recentes</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50">
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Evento</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Status</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">IP</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Recebido</th>
                  </tr>
                </thead>
                <tbody>
                  {logs.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-4 py-10 text-center text-slate-400">
                        Nenhum webhook recebido ainda.
                      </td>
                    </tr>
                  ) : (
                    logs.map((log) => (
                      <tr key={log.id} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/60 transition-colors">
                        <td className="px-4 py-3 font-mono text-xs text-slate-700">{log.evento}</td>
                        <td className="px-4 py-3">
                          <StatusBadge status={log.status === "200" || log.status === "ok" ? "SUCESSO" : "ERRO"} />
                        </td>
                        <td className="px-4 py-3 text-xs text-slate-500">{log.ip ?? "-"}</td>
                        <td className="px-4 py-3 text-xs text-slate-500">
                          {formatDistanceToNow(new Date(log.createdAt), { locale: ptBR, addSuffix: true })}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
