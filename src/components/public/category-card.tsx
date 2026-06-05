import Link from "next/link";
import {
  Building,
  Flag,
  Globe,
  Heart,
  GraduationCap,
  Shield,
  Scale,
  MapPin,
  LucideIcon,
} from "lucide-react";

const categoryIcons: Record<string, LucideIcon> = {
  municipal: MapPin,
  estadual: Flag,
  federal: Globe,
  saude: Heart,
  educacao: GraduationCap,
  seguranca: Shield,
  tribunais: Scale,
  prefeituras: Building,
};

const categoryColors: Record<string, string> = {
  municipal: "bg-brand-blue/8 text-brand-blue group-hover:bg-brand-blue/15",
  estadual: "bg-brand-blue/8 text-brand-blue group-hover:bg-brand-blue/15",
  federal: "bg-brand-blue/8 text-brand-blue group-hover:bg-brand-blue/15",
  saude: "bg-brand-blue/8 text-brand-blue group-hover:bg-brand-blue/15",
  educacao: "bg-brand-blue/8 text-brand-blue group-hover:bg-brand-blue/15",
  seguranca: "bg-brand-blue/8 text-brand-blue group-hover:bg-brand-blue/15",
  tribunais: "bg-brand-blue/8 text-brand-blue group-hover:bg-brand-blue/15",
  prefeituras: "bg-brand-blue/8 text-brand-blue group-hover:bg-brand-blue/15",
};

interface CategoryCardProps {
  nome: string;
  slug: string;
  descricao?: string | null;
  totalApostilas?: number;
}

export function CategoryCard({
  nome,
  slug,
  descricao,
  totalApostilas,
}: CategoryCardProps) {
  const iconKey = slug.toLowerCase().split("-")[0];
  const Icon = categoryIcons[iconKey] ?? Building;
  const colorClass =
    categoryColors[iconKey] ?? "bg-gray-50 text-gray-700 group-hover:bg-gray-100";

  return (
    <Link
      href={`/categorias/${slug}`}
      className="group flex flex-col items-center rounded-xl border border-gray-200 bg-white p-6 text-center shadow-sm transition-all duration-200 hover:shadow-md hover:-translate-y-1 hover:border-brand-gold/40"
    >
      <div
        className={`mb-4 flex h-14 w-14 items-center justify-center rounded-2xl transition-colors ${colorClass}`}
      >
        <Icon className="h-7 w-7" />
      </div>
      <h3 className="font-semibold text-gray-900 mb-1 group-hover:text-brand-blue transition-colors">
        {nome}
      </h3>
      {descricao && (
        <p className="text-xs text-gray-500 line-clamp-2 mb-2">{descricao}</p>
      )}
      {typeof totalApostilas === "number" && (
        <span className="mt-auto text-xs font-medium text-brand-gold">
          {totalApostilas} {totalApostilas === 1 ? "apostila" : "apostilas"}
        </span>
      )}
    </Link>
  );
}
