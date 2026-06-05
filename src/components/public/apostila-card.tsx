import Link from "next/link";
import { MapPin, Building2, Tag, ArrowRight } from "lucide-react";
import type { Apostila, Categoria, Banca, Orgao } from "@/generated/prisma";

type ApostilaWithRelations = Apostila & {
  categoria?: Categoria | null;
  banca?: Banca | null;
  orgao?: Orgao | null;
};

interface ApostilaCardProps {
  apostila: ApostilaWithRelations;
}

const nivelLabel: Record<string, string> = {
  FUNDAMENTAL: "Fund.",
  MEDIO: "Médio",
  TECNICO: "Técnico",
  SUPERIOR: "Superior",
};

export function ApostilaCard({ apostila }: ApostilaCardProps) {
  const preco = apostila.precoExibido
    ? Number(apostila.precoExibido).toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
      })
    : null;

  return (
    <article className="group flex flex-col rounded-xl border border-gray-200 bg-white shadow-sm transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 hover:border-brand-gold/30 overflow-hidden">
      {/* Mockup thumbnail */}
      {(apostila.imagemMockup || apostila.imagemCapa) && (
        <div className="flex items-center justify-center py-4 px-6">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={apostila.imagemMockup || apostila.imagemCapa || ""}
            alt={apostila.titulo}
            className="h-[140px] sm:h-[160px] w-auto object-contain transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />
        </div>
      )}

      <div className="flex flex-col flex-1 p-4 sm:p-5">
        {/* Category badge */}
        {apostila.categoria && (
          <div className="mb-3">
            <span className="inline-flex items-center gap-1 rounded-full bg-brand-gold px-2.5 py-0.5 text-xs font-semibold text-white whitespace-nowrap max-w-full overflow-hidden">
              <Tag className="h-3 w-3 flex-shrink-0" />
              <span className="truncate">{apostila.categoria.nome}</span>
            </span>
          </div>
        )}

        {/* Title */}
        <h3 className="mb-2 text-base font-semibold text-gray-900 leading-snug line-clamp-2 group-hover:text-brand-blue transition-colors">
          <Link href={`/apostilas/${apostila.slug}`} className="stretched-link">
            {apostila.titulo}
          </Link>
        </h3>

        {/* Meta info */}
        <div className="flex flex-col gap-1 mb-3 text-sm text-gray-500">
          {apostila.orgao && (
            <span className="flex items-center gap-1.5">
              <Building2 className="h-3.5 w-3.5 flex-shrink-0 text-gray-400" />
              <span className="truncate">{apostila.orgao.nome}</span>
            </span>
          )}
          {apostila.estado && (
            <span className="flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5 flex-shrink-0 text-gray-400" />
              {apostila.estado}
              {apostila.cidade ? ` - ${apostila.cidade}` : ""}
            </span>
          )}
        </div>

        {/* Tags row */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {apostila.nivel && (
            <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-600">
              {nivelLabel[apostila.nivel] ?? apostila.nivel}
            </span>
          )}
          {apostila.banca && (
            <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-600">
              {apostila.banca.nome}
            </span>
          )}
          {apostila.ano && (
            <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-600">
              {apostila.ano}
            </span>
          )}
        </div>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Price + CTA — stacks vertically on very small screens, side by side on sm+ */}
        <div className="flex flex-col min-[380px]:flex-row min-[380px]:items-center min-[380px]:justify-between gap-3 pt-4 border-t border-gray-100">
          <div>
            {preco ? (
              <span className="text-lg sm:text-xl font-bold text-brand-blue">{preco}</span>
            ) : (
              <span className="text-sm font-medium text-gray-500">
                Consulte o preço
              </span>
            )}
          </div>
          <Link
            href={`/apostilas/${apostila.slug}`}
            className="inline-flex w-full min-[380px]:w-auto items-center justify-center gap-1.5 rounded-lg bg-brand-gold px-4 min-h-[44px] text-sm font-semibold text-white transition-all hover:bg-brand-gold-dark active:scale-95 shadow-sm"
          >
            Ver Apostila
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </article>
  );
}
