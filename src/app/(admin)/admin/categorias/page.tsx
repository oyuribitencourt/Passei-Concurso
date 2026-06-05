"use client"

import { useState, useEffect } from "react"
import { Plus, Pencil, Check, X, ToggleLeft, ToggleRight, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { StatusBadge } from "@/components/admin/status-badge"

interface Categoria {
  id: string
  nome: string
  slug: string
  descricao: string | null
  ativo: boolean
  ordem: number
  _count: { apostilas: number }
}

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

export default function CategoriasPage() {
  const [categorias, setCategorias] = useState<Categoria[]>([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editNome, setEditNome] = useState("")
  const [editDescricao, setEditDescricao] = useState("")
  const [editOrdem, setEditOrdem] = useState(0)
  const [saving, setSaving] = useState(false)
  const [newNome, setNewNome] = useState("")
  const [newDescricao, setNewDescricao] = useState("")
  const [creating, setCreating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function fetchCategorias() {
    try {
      const res = await fetch("/api/admin/categorias?limit=100")
      if (res.ok) {
        const json = await res.json()
        setCategorias(Array.isArray(json) ? json : (json.data ?? []))
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchCategorias() }, [])

  function startEdit(cat: Categoria) {
    setEditingId(cat.id)
    setEditNome(cat.nome)
    setEditDescricao(cat.descricao ?? "")
    setEditOrdem(cat.ordem)
  }

  function cancelEdit() {
    setEditingId(null)
  }

  async function saveEdit(id: string) {
    setSaving(true)
    setError(null)
    try {
      const res = await fetch(`/api/admin/categorias/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nome: editNome, descricao: editDescricao, ordem: editOrdem }),
      })
      if (!res.ok) throw new Error("Erro ao salvar")
      await fetchCategorias()
      setEditingId(null)
    } catch {
      setError("Erro ao salvar categoria.")
    } finally {
      setSaving(false)
    }
  }

  async function toggleAtivo(id: string, ativo: boolean) {
    try {
      await fetch(`/api/admin/categorias/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ativo: !ativo }),
      })
      await fetchCategorias()
    } catch {
      setError("Erro ao alterar status.")
    }
  }

  async function createCategoria() {
    if (!newNome.trim()) return
    setCreating(true)
    setError(null)
    try {
      const res = await fetch("/api/admin/categorias", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nome: newNome.trim(),
          slug: slugify(newNome.trim()),
          descricao: newDescricao.trim() || null,
        }),
      })
      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err.error ?? "Erro ao criar categoria.")
      }
      setNewNome("")
      setNewDescricao("")
      await fetchCategorias()
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erro ao criar categoria.")
    } finally {
      setCreating(false)
    }
  }

  const inputClass = "rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Categorias</h1>
        <p className="text-sm text-slate-500">Gerencie as categorias de apostilas</p>
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      {/* Create form */}
      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="mb-4 text-sm font-semibold text-slate-700">Nova Categoria</h2>
        <div className="flex flex-wrap gap-3">
          <input
            value={newNome}
            onChange={(e) => setNewNome(e.target.value)}
            placeholder="Nome da categoria"
            className={cn(inputClass, "flex-1 min-w-48")}
            onKeyDown={(e) => e.key === "Enter" && createCategoria()}
          />
          <input
            value={newDescricao}
            onChange={(e) => setNewDescricao(e.target.value)}
            placeholder="Descrição (opcional)"
            className={cn(inputClass, "flex-1 min-w-48")}
          />
          <button
            onClick={createCategoria}
            disabled={creating || !newNome.trim()}
            className="flex items-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-500 transition-colors disabled:opacity-50"
          >
            {creating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
            Criar
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50">
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Nome</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Slug</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Apostilas</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Ordem</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Status</th>
              <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">Ações</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} className="px-4 py-12 text-center text-slate-400">
                  <Loader2 className="mx-auto h-5 w-5 animate-spin" />
                </td>
              </tr>
            ) : categorias.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-12 text-center text-slate-400">Nenhuma categoria cadastrada.</td>
              </tr>
            ) : (
              categorias.map((cat) => (
                <tr key={cat.id} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/60 transition-colors">
                  {editingId === cat.id ? (
                    <>
                      <td className="px-4 py-2" colSpan={2}>
                        <div className="flex flex-col gap-2">
                          <input
                            value={editNome}
                            onChange={(e) => setEditNome(e.target.value)}
                            className={inputClass}
                            placeholder="Nome"
                          />
                          <input
                            value={editDescricao}
                            onChange={(e) => setEditDescricao(e.target.value)}
                            className={inputClass}
                            placeholder="Descrição"
                          />
                        </div>
                      </td>
                      <td className="px-4 py-2 text-slate-600">{cat._count.apostilas}</td>
                      <td className="px-4 py-2">
                        <input
                          type="number"
                          value={editOrdem}
                          onChange={(e) => setEditOrdem(Number(e.target.value))}
                          className={cn(inputClass, "w-16")}
                        />
                      </td>
                      <td className="px-4 py-2">
                        <StatusBadge status={cat.ativo ? "ATIVO" : "INATIVO"} />
                      </td>
                      <td className="px-4 py-2 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button onClick={() => saveEdit(cat.id)} disabled={saving} className="rounded-md p-1.5 text-green-600 hover:bg-green-50 transition-colors">
                            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
                          </button>
                          <button onClick={cancelEdit} className="rounded-md p-1.5 text-slate-400 hover:bg-slate-100 transition-colors">
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </>
                  ) : (
                    <>
                      <td className="px-4 py-3">
                        <p className="font-medium text-slate-800">{cat.nome}</p>
                        {cat.descricao && <p className="text-xs text-slate-400 truncate max-w-xs">{cat.descricao}</p>}
                      </td>
                      <td className="px-4 py-3 text-xs text-slate-400">{cat.slug}</td>
                      <td className="px-4 py-3 text-slate-600">{cat._count.apostilas}</td>
                      <td className="px-4 py-3 text-slate-600">{cat.ordem}</td>
                      <td className="px-4 py-3">
                        <StatusBadge status={cat.ativo ? "ATIVO" : "INATIVO"} />
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => toggleAtivo(cat.id, cat.ativo)}
                            className={cn(
                              "rounded-md p-1.5 transition-colors",
                              cat.ativo
                                ? "text-green-500 hover:bg-green-50"
                                : "text-slate-300 hover:bg-slate-100"
                            )}
                            title={cat.ativo ? "Desativar" : "Ativar"}
                          >
                            {cat.ativo ? <ToggleRight className="h-5 w-5" /> : <ToggleLeft className="h-5 w-5" />}
                          </button>
                          <button
                            onClick={() => startEdit(cat)}
                            className="rounded-md p-1.5 text-slate-400 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                          >
                            <Pencil className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
