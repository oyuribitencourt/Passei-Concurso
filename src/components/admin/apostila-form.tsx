"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { Loader2, Save, Eye } from "lucide-react"
import { cn } from "@/lib/utils"
import { ImageUpload } from "@/components/admin/image-upload"

const apostilaSchema = z.object({
  titulo: z.string().min(3, "Título deve ter ao menos 3 caracteres"),
  slug: z.string().min(3, "Slug inválido").regex(/^[a-z0-9-]+$/, "Slug deve conter apenas letras minúsculas, números e hifens"),
  descricaoCurta: z.string().min(10, "Descrição curta deve ter ao menos 10 caracteres"),
  descricaoLonga: z.string().min(20, "Descrição longa deve ter ao menos 20 caracteres"),
  orgaoId: z.string().optional().nullable(),
  cargo: z.string().optional().nullable(),
  bancaId: z.string().optional().nullable(),
  estado: z.string().optional().nullable(),
  cidade: z.string().optional().nullable(),
  nivel: z.enum(["FUNDAMENTAL", "MEDIO", "TECNICO", "SUPERIOR"]).optional().nullable(),
  area: z.string().optional().nullable(),
  categoriaId: z.string().optional().nullable(),
  statusConcurso: z.enum(["ABERTO", "EM_ANDAMENTO", "ENCERRADO", "PREVISTO", "ANULADO"]),
  ano: z.coerce.number().int().min(2000).max(2100).optional().nullable(),
  conteudoProgramatico: z.string().optional().nullable(),
  beneficios: z.string().optional().nullable(),
  publicoAlvo: z.string().optional().nullable(),
  faq: z.string().optional().nullable(),
  imagemCapa: z.string().optional().nullable().or(z.literal("")),
  imagemMockup: z.string().optional().nullable().or(z.literal("")),
  imagemMockup2: z.string().optional().nullable().or(z.literal("")),
  imagemMockup3: z.string().optional().nullable().or(z.literal("")),
  imagemHeroBg: z.string().optional().nullable().or(z.literal("")),
  linkCheckoutTicto: z.string().url("URL inválida").optional().nullable().or(z.literal("")),
  idProdutoTicto: z.string().optional().nullable(),
  precoOriginal: z.coerce.number().min(0).optional().nullable(),
  precoExibido: z.coerce.number().min(0).optional().nullable(),
  status: z.enum(["RASCUNHO", "PUBLICADO", "PAUSADO", "PENDENTE_REVISAO"]),
  seoTitle: z.string().optional().nullable(),
  seoDescription: z.string().optional().nullable(),
  keywords: z.string().optional().nullable(),
  canonicalUrl: z.string().url("URL inválida").optional().nullable().or(z.literal("")),
  concursoId: z.string().optional().nullable(),
})

type ApostilaFormData = z.infer<typeof apostilaSchema>

interface SelectOption {
  id: string
  nome: string
}

interface ApostilaFormProps {
  initialData?: Partial<ApostilaFormData> & { id?: string }
  categorias: SelectOption[]
  orgaos: SelectOption[]
  bancas: SelectOption[]
  concursos: SelectOption[]
}

type TabKey = "basico" | "concurso" | "conteudo" | "ticto" | "seo"

const tabs: { key: TabKey; label: string }[] = [
  { key: "basico", label: "Informações Básicas" },
  { key: "concurso", label: "Detalhes do Concurso" },
  { key: "conteudo", label: "Conteúdo" },
  { key: "ticto", label: "Integração Ticto" },
  { key: "seo", label: "SEO" },
]

const ESTADOS = [
  "AC","AL","AP","AM","BA","CE","DF","ES","GO","MA","MT","MS","MG",
  "PA","PB","PR","PE","PI","RJ","RN","RS","RO","RR","SC","SP","SE","TO",
]

function slugify(text: string) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
}

export function ApostilaForm({
  initialData,
  categorias,
  orgaos,
  bancas,
  concursos,
}: ApostilaFormProps) {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<TabKey>("basico")
  const [saving, setSaving] = useState(false)
  const [globalError, setGlobalError] = useState<string | null>(null)

  const isEditing = !!initialData?.id

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ApostilaFormData>({
    resolver: zodResolver(apostilaSchema),
    defaultValues: {
      status: "RASCUNHO",
      statusConcurso: "ABERTO",
      ...initialData,
    },
  })

  const titulo = watch("titulo")

  // Auto-generate slug from title (only if not editing)
  useEffect(() => {
    if (!isEditing && titulo) {
      setValue("slug", slugify(titulo))
    }
  }, [titulo, isEditing, setValue])

  async function onSubmit(data: ApostilaFormData, statusOverride?: "RASCUNHO" | "PUBLICADO") {
    setSaving(true)
    setGlobalError(null)

    const payload = {
      ...data,
      status: statusOverride ?? data.status,
      // Clean empty strings to null
      orgaoId: data.orgaoId || null,
      bancaId: data.bancaId || null,
      categoriaId: data.categoriaId || null,
      concursoId: data.concursoId || null,
      imagemCapa: data.imagemCapa || null,
      imagemMockup: data.imagemMockup || null,
      imagemMockup2: data.imagemMockup2 || null,
      imagemMockup3: data.imagemMockup3 || null,
      imagemHeroBg: data.imagemHeroBg || null,
      precoOriginal: data.precoOriginal || null,
      linkCheckoutTicto: data.linkCheckoutTicto || null,
      canonicalUrl: data.canonicalUrl || null,
    }

    try {
      const url = isEditing
        ? `/api/admin/apostilas/${initialData.id}`
        : "/api/admin/apostilas"
      const method = isEditing ? "PUT" : "POST"

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err.error ?? "Erro ao salvar apostila.")
      }

      const saved = await res.json()
      router.push(`/admin/apostilas/${saved.id ?? initialData?.id}`)
      router.refresh()
    } catch (e) {
      setGlobalError(e instanceof Error ? e.message : "Erro inesperado.")
    } finally {
      setSaving(false)
    }
  }

  const inputClass =
    "w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 outline-none transition focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
  const labelClass = "mb-1 block text-sm font-medium text-slate-700"
  const errorClass = "mt-1 text-xs text-red-500"
  const textareaClass = cn(inputClass, "resize-y min-h-[100px]")
  const selectClass = cn(inputClass, "cursor-pointer")

  return (
    <form onSubmit={handleSubmit((d) => onSubmit(d))} className="space-y-6">
      {/* Tabs */}
      <div className="flex gap-1 overflow-x-auto rounded-xl border border-slate-200 bg-white p-1 shadow-sm">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setActiveTab(tab.key)}
            className={cn(
              "shrink-0 rounded-lg px-4 py-2 text-sm font-medium transition-colors",
              activeTab === tab.key
                ? "bg-blue-600 text-white shadow-sm"
                : "text-slate-500 hover:bg-slate-100 hover:text-slate-700"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab: Informações Básicas */}
      {activeTab === "basico" && (
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className={labelClass}>Título *</label>
              <input {...register("titulo")} className={inputClass} placeholder="Ex: Apostila Concurso INSS 2024" />
              {errors.titulo && <p className={errorClass}>{errors.titulo.message}</p>}
            </div>

            <div>
              <label className={labelClass}>Slug *</label>
              <input {...register("slug")} className={inputClass} placeholder="apostila-concurso-inss-2024" />
              {errors.slug && <p className={errorClass}>{errors.slug.message}</p>}
            </div>

            <div>
              <label className={labelClass}>Categoria</label>
              <select {...register("categoriaId")} className={selectClass}>
                <option value="">Selecione uma categoria</option>
                {categorias.map((c) => (
                  <option key={c.id} value={c.id}>{c.nome}</option>
                ))}
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className={labelClass}>Descrição Curta *</label>
              <textarea
                {...register("descricaoCurta")}
                className={textareaClass}
                placeholder="Breve descrição exibida nas listagens..."
              />
              {errors.descricaoCurta && <p className={errorClass}>{errors.descricaoCurta.message}</p>}
            </div>

            <div className="sm:col-span-2">
              <label className={labelClass}>Descrição Longa *</label>
              <textarea
                {...register("descricaoLonga")}
                rows={6}
                className={cn(textareaClass, "min-h-[150px]")}
                placeholder="Descrição completa da apostila..."
              />
              {errors.descricaoLonga && <p className={errorClass}>{errors.descricaoLonga.message}</p>}
            </div>

            <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 space-y-5">
              <h4 className="text-sm font-semibold text-slate-700">Imagens da Apostila</h4>

              <ImageUpload
                label="Imagem de Capa"
                hint="Imagem genérica usada em cards e compartilhamento social."
                value={watch("imagemCapa")}
                onChange={(url) => setValue("imagemCapa", url, { shouldDirty: true })}
                folder="apostilas/capas"
              />

              <ImageUpload
                label="Mockup Principal (frente)"
                hint="Mockup principal que fica na frente. Será exibido com destaque no hero da página."
                value={watch("imagemMockup")}
                onChange={(url) => setValue("imagemMockup", url, { shouldDirty: true })}
                folder="apostilas/mockups"
              />

              <ImageUpload
                label="Mockup 2 (atrás esquerda)"
                hint="Segundo mockup, aparece atrás do principal, levemente deslocado à esquerda."
                value={watch("imagemMockup2")}
                onChange={(url) => setValue("imagemMockup2", url, { shouldDirty: true })}
                folder="apostilas/mockups"
              />

              <ImageUpload
                label="Mockup 3 (atrás direita)"
                hint="Terceiro mockup, aparece atrás do principal, levemente deslocado à direita."
                value={watch("imagemMockup3")}
                onChange={(url) => setValue("imagemMockup3", url, { shouldDirty: true })}
                folder="apostilas/mockups"
              />

              <ImageUpload
                label="Background do Hero"
                hint="Foto de fundo na seção principal da página do produto. Ficará com overlay escuro para legibilidade."
                value={watch("imagemHeroBg")}
                onChange={(url) => setValue("imagemHeroBg", url, { shouldDirty: true })}
                folder="apostilas/heroes"
              />
            </div>

            <div>
              <label className={labelClass}>Status</label>
              <select {...register("status")} className={selectClass}>
                <option value="RASCUNHO">Rascunho</option>
                <option value="PUBLICADO">Publicado</option>
                <option value="PAUSADO">Pausado</option>
                <option value="PENDENTE_REVISAO">Pendente Revisão</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Tab: Detalhes do Concurso */}
      {activeTab === "concurso" && (
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className={labelClass}>Órgão</label>
              <select {...register("orgaoId")} className={selectClass}>
                <option value="">Selecione um órgão</option>
                {orgaos.map((o) => (
                  <option key={o.id} value={o.id}>{o.nome}</option>
                ))}
              </select>
            </div>

            <div>
              <label className={labelClass}>Banca</label>
              <select {...register("bancaId")} className={selectClass}>
                <option value="">Selecione uma banca</option>
                {bancas.map((b) => (
                  <option key={b.id} value={b.id}>{b.nome}</option>
                ))}
              </select>
            </div>

            <div>
              <label className={labelClass}>Cargo</label>
              <input {...register("cargo")} className={inputClass} placeholder="Ex: Técnico Administrativo" />
            </div>

            <div>
              <label className={labelClass}>Área</label>
              <input {...register("area")} className={inputClass} placeholder="Ex: Administrativa" />
            </div>

            <div>
              <label className={labelClass}>Estado</label>
              <select {...register("estado")} className={selectClass}>
                <option value="">Selecione</option>
                {ESTADOS.map((uf) => (
                  <option key={uf} value={uf}>{uf}</option>
                ))}
              </select>
            </div>

            <div>
              <label className={labelClass}>Cidade</label>
              <input {...register("cidade")} className={inputClass} placeholder="Ex: São Paulo" />
            </div>

            <div>
              <label className={labelClass}>Nível de Escolaridade</label>
              <select {...register("nivel")} className={selectClass}>
                <option value="">Selecione</option>
                <option value="FUNDAMENTAL">Fundamental</option>
                <option value="MEDIO">Médio</option>
                <option value="TECNICO">Técnico</option>
                <option value="SUPERIOR">Superior</option>
              </select>
            </div>

            <div>
              <label className={labelClass}>Status do Concurso</label>
              <select {...register("statusConcurso")} className={selectClass}>
                <option value="ABERTO">Aberto</option>
                <option value="EM_ANDAMENTO">Em Andamento</option>
                <option value="ENCERRADO">Encerrado</option>
                <option value="PREVISTO">Previsto</option>
                <option value="ANULADO">Anulado</option>
              </select>
            </div>

            <div>
              <label className={labelClass}>Ano</label>
              <input {...register("ano")} type="number" className={inputClass} placeholder="2024" min={2000} max={2100} />
              {errors.ano && <p className={errorClass}>{errors.ano.message}</p>}
            </div>

            <div>
              <label className={labelClass}>Concurso vinculado</label>
              <select {...register("concursoId")} className={selectClass}>
                <option value="">Nenhum</option>
                {concursos.map((c) => (
                  <option key={c.id} value={c.id}>{c.nome}</option>
                ))}
              </select>
            </div>

            <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 space-y-4">
              <h4 className="text-sm font-semibold text-slate-700">Preços</h4>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className={labelClass}>Preço Original / "De" (R$)</label>
                  <input {...register("precoOriginal")} type="number" step="0.01" className={inputClass} placeholder="0.00" />
                  <p className="mt-1 text-xs text-slate-400">Preço antigo riscado. Deixe vazio se não houver desconto.</p>
                </div>
                <div>
                  <label className={labelClass}>Preço Atual / "Por" (R$)</label>
                  <input {...register("precoExibido")} type="number" step="0.01" className={inputClass} placeholder="0.00" />
                  <p className="mt-1 text-xs text-slate-400">Preço final que o cliente paga.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab: Conteudo */}
      {activeTab === "conteudo" && (
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
          <div>
            <label className={labelClass}>Conteúdo Programático</label>
            <textarea {...register("conteudoProgramatico")} rows={8} className={cn(textareaClass, "min-h-[200px]")} placeholder="Liste os tópicos abordados..." />
          </div>
          <div>
            <label className={labelClass}>Público-Alvo</label>
            <textarea {...register("publicoAlvo")} rows={4} className={textareaClass} placeholder="Para quem é esta apostila..." />
          </div>
          <div>
            <label className={labelClass}>Benefícios</label>
            <textarea {...register("beneficios")} rows={4} className={textareaClass} placeholder="Vantagens de adquirir esta apostila..." />
          </div>
          <div>
            <label className={labelClass}>FAQ (Perguntas Frequentes)</label>
            <textarea {...register("faq")} rows={6} className={cn(textareaClass, "min-h-[150px]")} placeholder="Perguntas e respostas frequentes..." />
          </div>
        </div>
      )}

      {/* Tab: Ticto */}
      {activeTab === "ticto" && (
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
          <p className="text-sm text-slate-500">
            Configure a integração com o checkout Ticto para esta apostila.
          </p>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className={labelClass}>Link de Checkout Ticto (URL)</label>
              <input {...register("linkCheckoutTicto")} className={inputClass} placeholder="https://pay.ticto.app/..." />
              {errors.linkCheckoutTicto && <p className={errorClass}>{errors.linkCheckoutTicto.message}</p>}
            </div>
            <div>
              <label className={labelClass}>ID do Produto Ticto</label>
              <input {...register("idProdutoTicto")} className={inputClass} placeholder="prod_abc123" />
            </div>
          </div>
        </div>
      )}

      {/* Tab: SEO */}
      {activeTab === "seo" && (
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className={labelClass}>SEO Title</label>
              <input {...register("seoTitle")} className={inputClass} placeholder="Título para mecanismos de busca (máx 60 caracteres)" maxLength={60} />
            </div>
            <div>
              <label className={labelClass}>SEO Description</label>
              <textarea {...register("seoDescription")} rows={3} className={textareaClass} placeholder="Meta descrição (máx 160 caracteres)" maxLength={160} />
            </div>
            <div>
              <label className={labelClass}>Keywords</label>
              <input {...register("keywords")} className={inputClass} placeholder="apostila, concurso, inss, técnico (separadas por vírgula)" />
            </div>
            <div>
              <label className={labelClass}>URL Canônica</label>
              <input {...register("canonicalUrl")} className={inputClass} placeholder="https://passeiconcurso.com.br/apostilas/..." />
              {errors.canonicalUrl && <p className={errorClass}>{errors.canonicalUrl.message}</p>}
            </div>
          </div>
        </div>
      )}

      {/* Error global */}
      {globalError && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {globalError}
        </div>
      )}

      {/* Actions */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white px-6 py-4 shadow-sm">
        <button
          type="button"
          onClick={() => router.back()}
          className="text-sm text-slate-500 hover:text-slate-700 transition-colors"
        >
          Cancelar
        </button>
        <div className="flex gap-2">
          <button
            type="button"
            disabled={saving}
            onClick={handleSubmit((d) => onSubmit(d, "RASCUNHO"))}
            className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors disabled:opacity-50"
          >
            <Save className="h-4 w-4" />
            Salvar Rascunho
          </button>
          <button
            type="button"
            disabled={saving}
            onClick={handleSubmit((d) => onSubmit(d, "PUBLICADO"))}
            className="flex items-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-500 transition-colors disabled:opacity-50"
          >
            {saving ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
            {saving ? "Salvando..." : "Publicar"}
          </button>
        </div>
      </div>
    </form>
  )
}
