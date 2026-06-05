import { cn } from "@/lib/utils"

type StatusBadgeVariant =
  | "RASCUNHO"
  | "PUBLICADO"
  | "PAUSADO"
  | "PENDENTE_REVISAO"
  | "ABERTO"
  | "EM_ANDAMENTO"
  | "ENCERRADO"
  | "PREVISTO"
  | "ANULADO"
  | "NOVA"
  | "EM_ANALISE"
  | "CONVERTIDA"
  | "IGNORADA"
  | "ATIVO"
  | "INATIVO"
  | "INFO"
  | "SUCESSO"
  | "ERRO"
  | "ALERTA"

const labels: Record<StatusBadgeVariant, string> = {
  RASCUNHO: "Rascunho",
  PUBLICADO: "Publicado",
  PAUSADO: "Pausado",
  PENDENTE_REVISAO: "Pendente de Revisão",
  ABERTO: "Aberto",
  EM_ANDAMENTO: "Em Andamento",
  ENCERRADO: "Encerrado",
  PREVISTO: "Previsto",
  ANULADO: "Anulado",
  NOVA: "Nova",
  EM_ANALISE: "Em Análise",
  CONVERTIDA: "Convertida",
  IGNORADA: "Ignorada",
  ATIVO: "Ativo",
  INATIVO: "Inativo",
  INFO: "Info",
  SUCESSO: "Sucesso",
  ERRO: "Erro",
  ALERTA: "Alerta",
}

const styles: Record<StatusBadgeVariant, string> = {
  RASCUNHO: "bg-slate-100 text-slate-700",
  PUBLICADO: "bg-green-100 text-green-700",
  PAUSADO: "bg-yellow-100 text-yellow-700",
  PENDENTE_REVISAO: "bg-orange-100 text-orange-700",
  ABERTO: "bg-green-100 text-green-700",
  EM_ANDAMENTO: "bg-blue-100 text-blue-700",
  ENCERRADO: "bg-slate-100 text-slate-600",
  PREVISTO: "bg-purple-100 text-purple-700",
  ANULADO: "bg-red-100 text-red-700",
  NOVA: "bg-blue-100 text-blue-700",
  EM_ANALISE: "bg-yellow-100 text-yellow-700",
  CONVERTIDA: "bg-green-100 text-green-700",
  IGNORADA: "bg-slate-100 text-slate-500",
  ATIVO: "bg-green-100 text-green-700",
  INATIVO: "bg-slate-100 text-slate-500",
  INFO: "bg-blue-100 text-blue-700",
  SUCESSO: "bg-green-100 text-green-700",
  ERRO: "bg-red-100 text-red-700",
  ALERTA: "bg-yellow-100 text-yellow-700",
}

interface StatusBadgeProps {
  status: StatusBadgeVariant | string
  className?: string
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const variant = status as StatusBadgeVariant
  const label = labels[variant] ?? status
  const style = styles[variant] ?? "bg-slate-100 text-slate-600"

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        style,
        className
      )}
    >
      {label}
    </span>
  )
}
