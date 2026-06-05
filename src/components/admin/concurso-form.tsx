"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { Loader2, Save } from "lucide-react"
import { cn } from "@/lib/utils"

const concursoSchema = z.object({
  nome: z.string().min(3, "Nome deve ter ao menos 3 caracteres"),
  slug: z.string().min(3, "Slug inválido").regex(/^[a-z0-9-]+$/, "Slug deve conter apenas letras minúsculas, números e hifens"),
  orgaoId: z.string().optional().nullable(),
  bancaId: z.string().optional().nullable(),
  estado: z.string().optional().nullable(),
  cidade: z.string().optional().nullable(),
  cargos: z.string().optional().nullable(),
  nivel: z.enum(["FUNDAMENTAL", "MEDIO", "TECNICO", "SUPERIOR"]).optional().nullable(),
  area: z.string().optional().nullable(),
  status: z.enum(["ABERTO", "EM_ANDAMENTO", "ENCERRADO", "PREVISTO", "ANULADO"]),
  ano: z.coerce.number().int().min(2000).max(2100).optional().nullable(),
  linkReferencia: z.string().url("URL inválida").optional().nullable().or(z.literal("")),
  observacoes: z.string().optional().nullable(),
})

type ConcursoFormData = z.infer<typeof concursoSchema>

interface SelectOption {
  id: string
  nome: string
}

interface ConcursoFormProps {
  initialData?: Partial<ConcursoFormData> & { id?: string }
  orgaos: SelectOption[]
  bancas: SelectOption[]
}

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

export function ConcursoForm({ initialData, orgaos, bancas }: ConcursoFormProps) {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [globalError, setGlobalError] = useState<string | null>(null)

  const isEditing = !!initialData?.id

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ConcursoFormData>({
    resolver: zodResolver(concursoSchema),
    defaultValues: {
      status: "ABERTO",
      ...initialData,
    },
  })

  const nome = watch("nome")

  useEffect(() => {
    if (!isEditing && nome) {
      setValue("slug", slugify(nome))
    }
  }, [nome, isEditing, setValue])

  async function onSubmit(data: ConcursoFormData) {
    setSaving(true)
    setGlobalError(null)

    const payload = {
      ...data,
      orgaoId: data.orgaoId || null,
      bancaId: data.bancaId || null,
      linkReferencia: data.linkReferencia || null,
    }

    try {
      const url = isEditing
        ? `/api/admin/concursos/${initialData!.id}`
        : "/api/admin/concursos"
      const method = isEditing ? "PUT" : "POST"

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err.error ?? "Erro ao salvar concurso.")
      }

      const saved = await res.json()
      router.push(`/admin/concursos/${saved.id ?? initialData?.id}`)
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
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-sm font-semibold text-slate-700">Dados do Concurso</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className={labelClass}>Nome *</label>
            <input {...register("nome")} className={inputClass} placeholder="Ex: Concurso INSS 2024" />
            {errors.nome && <p className={errorClass}>{errors.nome.message}</p>}
          </div>

          <div>
            <label className={labelClass}>Slug *</label>
            <input {...register("slug")} className={inputClass} placeholder="concurso-inss-2024" />
            {errors.slug && <p className={errorClass}>{errors.slug.message}</p>}
          </div>

          <div>
            <label className={labelClass}>Status</label>
            <select {...register("status")} className={selectClass}>
              <option value="ABERTO">Aberto</option>
              <option value="EM_ANDAMENTO">Em Andamento</option>
              <option value="ENCERRADO">Encerrado</option>
              <option value="PREVISTO">Previsto</option>
              <option value="ANULADO">Anulado</option>
            </select>
          </div>

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
            <input {...register("cidade")} className={inputClass} placeholder="Ex: Brasília" />
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
            <label className={labelClass}>Área</label>
            <input {...register("area")} className={inputClass} placeholder="Ex: Fiscal" />
          </div>

          <div>
            <label className={labelClass}>Ano</label>
            <input {...register("ano")} type="number" className={inputClass} placeholder="2024" min={2000} max={2100} />
            {errors.ano && <p className={errorClass}>{errors.ano.message}</p>}
          </div>

          <div>
            <label className={labelClass}>Link de Referência (URL)</label>
            <input {...register("linkReferencia")} className={inputClass} placeholder="https://..." />
            {errors.linkReferencia && <p className={errorClass}>{errors.linkReferencia.message}</p>}
          </div>

          <div className="sm:col-span-2">
            <label className={labelClass}>Cargos</label>
            <textarea {...register("cargos")} rows={4} className={textareaClass} placeholder="Liste os cargos disponibilizados neste concurso..." />
          </div>

          <div className="sm:col-span-2">
            <label className={labelClass}>Observações</label>
            <textarea {...register("observacoes")} rows={3} className={textareaClass} placeholder="Informações adicionais sobre o concurso..." />
          </div>
        </div>
      </div>

      {globalError && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {globalError}
        </div>
      )}

      <div className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white px-6 py-4 shadow-sm">
        <button
          type="button"
          onClick={() => router.back()}
          className="text-sm text-slate-500 hover:text-slate-700 transition-colors"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={saving}
          className="flex items-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-500 transition-colors disabled:opacity-50"
        >
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          {saving ? "Salvando..." : "Salvar Concurso"}
        </button>
      </div>
    </form>
  )
}
