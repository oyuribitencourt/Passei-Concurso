"use client"

import { useEffect, useState } from "react"
import { Activity, Save, ExternalLink, AlertCircle, CheckCircle2 } from "lucide-react"

interface TrackingConfig {
  metaPixelId: string | null
  googleAdsId: string | null
  googleAnalyticsId: string | null
  googleSearchConsoleId: string | null
  metaDomainVerification: string | null
}

export default function RastreamentoPage() {
  const [config, setConfig] = useState<TrackingConfig>({
    metaPixelId: null,
    googleAdsId: null,
    googleAnalyticsId: null,
    googleSearchConsoleId: null,
    metaDomainVerification: null,
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)

  useEffect(() => {
    fetch("/api/admin/configuracoes/rastreamento")
      .then((r) => r.json())
      .then((data) => {
        setConfig({
          metaPixelId: data.metaPixelId || "",
          googleAdsId: data.googleAdsId || "",
          googleAnalyticsId: data.googleAnalyticsId || "",
          googleSearchConsoleId: data.googleSearchConsoleId || "",
          metaDomainVerification: data.metaDomainVerification || "",
        })
      })
      .catch(() => setMessage({ type: "error", text: "Erro ao carregar configurações" }))
      .finally(() => setLoading(false))
  }, [])

  async function handleSave() {
    setSaving(true)
    setMessage(null)
    try {
      const res = await fetch("/api/admin/configuracoes/rastreamento", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(config),
      })
      if (!res.ok) throw new Error("Erro ao salvar")
      setMessage({ type: "success", text: "Configurações salvas com sucesso!" })
    } catch {
      setMessage({ type: "error", text: "Erro ao salvar configurações" })
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Rastreamento & Analytics</h1>
          <p className="text-sm text-slate-500">Carregando...</p>
        </div>
      </div>
    )
  }

  const pixels = [
    {
      id: "metaPixelId" as const,
      label: "Meta Pixel (Facebook Ads)",
      description: "Insira o ID do seu pixel do Meta/Facebook para rastrear conversões e criar públicos personalizados.",
      placeholder: "Ex: 1234567890123456",
      helpUrl: "https://www.facebook.com/business/help/952192354843755",
      helpLabel: "Como encontrar seu Pixel ID",
      icon: (
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
        </svg>
      ),
      color: "bg-blue-500",
    },
    {
      id: "googleAdsId" as const,
      label: "Google Ads",
      description: "Insira o ID de conversão do Google Ads para rastrear conversões de anúncios.",
      placeholder: "Ex: AW-1234567890",
      helpUrl: "https://support.google.com/google-ads/answer/6095821",
      helpLabel: "Como encontrar seu ID do Google Ads",
      icon: (
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
          <path d="M12.24 10.285V14.4h6.806c-.275 1.765-2.056 5.174-6.806 5.174-4.095 0-7.439-3.389-7.439-7.574s3.345-7.574 7.439-7.574c2.33 0 3.891.989 4.785 1.849l3.254-3.138C18.189 1.186 15.479 0 12.24 0c-6.635 0-12 5.365-12 12s5.365 12 12 12c6.926 0 11.52-4.869 11.52-11.726 0-.788-.085-1.39-.189-1.989H12.24z" />
        </svg>
      ),
      color: "bg-green-500",
    },
    {
      id: "googleAnalyticsId" as const,
      label: "Google Analytics 4",
      description: "Insira o ID de medição do Google Analytics (GA4) para acompanhar o tráfego e comportamento dos visitantes.",
      placeholder: "Ex: G-XXXXXXXXXX",
      helpUrl: "https://support.google.com/analytics/answer/9539598",
      helpLabel: "Como encontrar seu ID do GA4",
      icon: (
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
          <path d="M22.84 2.998v17.998c.005.344-.063.685-.2 1.001a2.397 2.397 0 0 1-1.238 1.238c-.316.137-.657.205-1.001.2a2.398 2.398 0 0 1-2.398-2.438V3a2.4 2.4 0 1 1 4.838 0zM14.838 12v9.002A2.398 2.398 0 0 1 12 23.44a2.397 2.397 0 0 1-2.398-2.438V12a2.4 2.4 0 1 1 4.838 0h-.001zM4.8 19.2a2.4 2.4 0 1 0 0 4.8 2.4 2.4 0 0 0 0-4.8z" />
        </svg>
      ),
      color: "bg-amber-500",
    },
    {
      id: "googleSearchConsoleId" as const,
      label: "Google Search Console",
      description: "Insira o código de verificação do Google Search Console para indexar seu site no Google.",
      placeholder: "Ex: abc123def456...",
      helpUrl: "https://support.google.com/webmasters/answer/9008080",
      helpLabel: "Como verificar seu site no Search Console",
      icon: (
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
          <path d="M22.84 2.998v17.998c.005.344-.063.685-.2 1.001a2.397 2.397 0 0 1-1.238 1.238c-.316.137-.657.205-1.001.2a2.398 2.398 0 0 1-2.398-2.438V3a2.4 2.4 0 1 1 4.838 0zM14.838 12v9.002A2.398 2.398 0 0 1 12 23.44a2.397 2.397 0 0 1-2.398-2.438V12a2.4 2.4 0 1 1 4.838 0h-.001zM4.8 19.2a2.4 2.4 0 1 0 0 4.8 2.4 2.4 0 0 0 0-4.8z" />
        </svg>
      ),
      color: "bg-rose-500",
    },
    {
      id: "metaDomainVerification" as const,
      label: "Meta Domain Verification",
      description: "Insira o código de verificação de domínio do Meta Business para vincular ao Facebook/Instagram.",
      placeholder: "Ex: abc123def456...",
      helpUrl: "https://developers.facebook.com/docs/sharing/domain-verification",
      helpLabel: "Como verificar seu domínio no Meta",
      icon: (
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
        </svg>
      ),
      color: "bg-indigo-500",
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Rastreamento & Analytics</h1>
          <p className="text-sm text-slate-500">
            Configure os pixels e códigos de rastreamento para anúncios e analytics
          </p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-700 disabled:opacity-50"
        >
          <Save className="h-4 w-4" />
          {saving ? "Salvando..." : "Salvar Alterações"}
        </button>
      </div>

      {message && (
        <div
          className={`flex items-center gap-2 rounded-lg border px-4 py-3 text-sm ${
            message.type === "success"
              ? "border-emerald-200 bg-emerald-50 text-emerald-700"
              : "border-red-200 bg-red-50 text-red-700"
          }`}
        >
          {message.type === "success" ? (
            <CheckCircle2 className="h-4 w-4 flex-shrink-0" />
          ) : (
            <AlertCircle className="h-4 w-4 flex-shrink-0" />
          )}
          {message.text}
        </div>
      )}

      {/* Info banner */}
      <div className="rounded-xl border border-blue-100 bg-blue-50 p-4">
        <div className="flex gap-3">
          <Activity className="h-5 w-5 flex-shrink-0 text-blue-600 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-blue-900">
              Como funciona o rastreamento
            </p>
            <p className="mt-1 text-xs text-blue-700">
              Os códigos de rastreamento e verificação serão inseridos automaticamente em todas as páginas públicas do site.
              Basta inserir os IDs correspondentes e salvar. Os scripts de tracking serão carregados de forma otimizada
              e as meta tags de verificação (Search Console, Meta) serão adicionadas ao head do site.
            </p>
          </div>
        </div>
      </div>

      {/* Pixel cards */}
      <div className="space-y-4">
        {pixels.map((pixel) => (
          <div
            key={pixel.id}
            className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden"
          >
            <div className="flex items-center gap-3 border-b border-slate-100 px-6 py-4">
              <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${pixel.color} text-white`}>
                {pixel.icon}
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-semibold text-slate-900">{pixel.label}</h3>
                <p className="text-xs text-slate-500">{pixel.description}</p>
              </div>
              {config[pixel.id] && (
                <span className="flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  Ativo
                </span>
              )}
            </div>
            <div className="px-6 py-4">
              <label className="mb-1.5 block text-xs font-medium text-slate-700">
                ID de Rastreamento
              </label>
              <input
                type="text"
                value={config[pixel.id] || ""}
                onChange={(e) =>
                  setConfig((prev) => ({ ...prev, [pixel.id]: e.target.value }))
                }
                placeholder={pixel.placeholder}
                className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-colors"
              />
              <a
                href={pixel.helpUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 inline-flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700 hover:underline"
              >
                <ExternalLink className="h-3 w-3" />
                {pixel.helpLabel}
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* Status summary */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h3 className="mb-4 text-sm font-semibold text-slate-700">Status dos Pixels</h3>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {pixels.map((pixel) => (
            <div
              key={pixel.id}
              className={`flex items-center gap-3 rounded-lg border p-3 ${
                config[pixel.id]
                  ? "border-emerald-200 bg-emerald-50"
                  : "border-slate-100 bg-slate-50"
              }`}
            >
              <div
                className={`h-2.5 w-2.5 rounded-full ${
                  config[pixel.id] ? "bg-emerald-500" : "bg-slate-300"
                }`}
              />
              <div>
                <p className="text-xs font-medium text-slate-700">{pixel.label}</p>
                <p className="text-[10px] text-slate-500">
                  {config[pixel.id] ? "Configurado" : "Não configurado"}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
