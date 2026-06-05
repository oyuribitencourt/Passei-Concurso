import { cn } from "@/lib/utils"
import type { LucideIcon } from "lucide-react"

interface StatCardProps {
  titulo: string
  valor: number | string
  descricao?: string
  icon: LucideIcon
  cor?: "azul" | "verde" | "amarelo" | "vermelho" | "roxo" | "slate"
  className?: string
}

const corMap = {
  azul: {
    icon: "bg-blue-100 text-blue-600",
    border: "border-blue-100",
  },
  verde: {
    icon: "bg-green-100 text-green-600",
    border: "border-green-100",
  },
  amarelo: {
    icon: "bg-yellow-100 text-yellow-600",
    border: "border-yellow-100",
  },
  vermelho: {
    icon: "bg-red-100 text-red-600",
    border: "border-red-100",
  },
  roxo: {
    icon: "bg-purple-100 text-purple-600",
    border: "border-purple-100",
  },
  slate: {
    icon: "bg-slate-100 text-slate-600",
    border: "border-slate-100",
  },
}

export function StatCard({
  titulo,
  valor,
  descricao,
  icon: Icon,
  cor = "azul",
  className,
}: StatCardProps) {
  const colors = corMap[cor]

  return (
    <div
      className={cn(
        "rounded-xl border bg-white p-5 shadow-sm",
        colors.border,
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-slate-500">{titulo}</p>
          <p className="mt-1 text-3xl font-bold text-slate-900">{valor}</p>
          {descricao && (
            <p className="mt-1 text-xs text-slate-400">{descricao}</p>
          )}
        </div>
        <div className={cn("rounded-lg p-2.5", colors.icon)}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </div>
  )
}
