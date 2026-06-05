"use client"

import { useState, useRef, useCallback } from "react"
import { Upload, X, Loader2, ImageIcon } from "lucide-react"

interface ImageUploadProps {
  value?: string | null
  onChange: (url: string | null) => void
  label: string
  hint?: string
  folder?: string
}

export function ImageUpload({
  value,
  onChange,
  label,
  hint,
  folder = "apostilas",
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [dragOver, setDragOver] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleUpload = useCallback(
    async (file: File) => {
      setError(null)
      setUploading(true)

      try {
        const formData = new FormData()
        formData.append("file", file)
        formData.append("folder", folder)

        const res = await fetch("/api/admin/upload", {
          method: "POST",
          body: formData,
        })

        if (!res.ok) {
          const data = await res.json().catch(() => ({}))
          throw new Error(data.error || "Erro ao fazer upload")
        }

        const data = await res.json()
        onChange(data.url)
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "Erro ao fazer upload"
        setError(message)
      } finally {
        setUploading(false)
      }
    },
    [folder, onChange]
  )

  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) handleUpload(file)
    if (inputRef.current) inputRef.current.value = ""
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault()
    setDragOver(false)
    const file = e.dataTransfer.files?.[0]
    if (file) handleUpload(file)
  }

  function handleRemove() {
    onChange(null)
    setError(null)
  }

  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-slate-700">
        {label}
      </label>

      {value ? (
        <div className="relative group rounded-lg border border-slate-200 bg-white overflow-hidden">
          <div className="relative aspect-video w-full bg-slate-50 flex items-center justify-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={value}
              alt={label}
              className="max-h-48 w-auto object-contain"
            />
          </div>
          <div className="flex items-center justify-between gap-2 px-3 py-2 border-t border-slate-100 bg-slate-50">
            <span className="text-xs text-slate-500 truncate flex-1">
              {value}
            </span>
            <div className="flex gap-1">
              <button
                type="button"
                onClick={() => inputRef.current?.click()}
                className="rounded px-2 py-1 text-xs font-medium text-slate-600 hover:bg-slate-200 transition-colors"
              >
                Trocar
              </button>
              <button
                type="button"
                onClick={handleRemove}
                className="rounded px-2 py-1 text-xs font-medium text-red-600 hover:bg-red-50 transition-colors"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            onChange={handleFileSelect}
            className="hidden"
          />
        </div>
      ) : (
        <div
          onDragOver={(e) => {
            e.preventDefault()
            setDragOver(true)
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => !uploading && inputRef.current?.click()}
          className={`relative cursor-pointer rounded-lg border-2 border-dashed p-6 text-center transition-colors ${
            dragOver
              ? "border-blue-400 bg-blue-50"
              : "border-slate-300 bg-slate-50 hover:border-slate-400 hover:bg-slate-100"
          } ${uploading ? "pointer-events-none opacity-60" : ""}`}
        >
          {uploading ? (
            <div className="flex flex-col items-center gap-2">
              <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
              <p className="text-sm text-slate-500">Enviando...</p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-200">
                {dragOver ? (
                  <Upload className="h-6 w-6 text-blue-500" />
                ) : (
                  <ImageIcon className="h-6 w-6 text-slate-400" />
                )}
              </div>
              <div>
                <p className="text-sm font-medium text-slate-600">
                  Clique para enviar ou arraste aqui
                </p>
                <p className="text-xs text-slate-400 mt-0.5">
                  JPG, PNG, WebP ou GIF (máx. 5MB)
                </p>
              </div>
            </div>
          )}
          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            onChange={handleFileSelect}
            className="hidden"
          />
        </div>
      )}

      {hint && !error && (
        <p className="mt-1.5 text-xs text-slate-400">{hint}</p>
      )}
      {error && (
        <p className="mt-1.5 text-xs text-red-500">{error}</p>
      )}
    </div>
  )
}
