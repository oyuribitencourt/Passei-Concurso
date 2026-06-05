import { Search, FileX } from "lucide-react";
import Link from "next/link";

interface EmptyStateProps {
  title?: string;
  description?: string;
  icon?: "search" | "file";
  action?: {
    label: string;
    href: string;
  };
}

export function EmptyState({
  title = "Nenhum resultado encontrado",
  description = "Tente ajustar os filtros ou buscar por outros termos.",
  icon = "search",
  action,
}: EmptyStateProps) {
  const Icon = icon === "search" ? Search : FileX;

  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-brand-gold-light mb-6">
        <Icon className="h-9 w-9 text-brand-gold-dark" />
      </div>
      <h3 className="text-xl font-semibold text-brand-blue mb-2">{title}</h3>
      <p className="text-gray-500 max-w-md mb-6">{description}</p>
      {action && (
        <Link
          href={action.href}
          className="inline-flex items-center gap-2 rounded-lg bg-brand-gold px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-gold-dark"
        >
          {action.label}
        </Link>
      )}
    </div>
  );
}
