import type { Metadata } from "next";
import { Suspense } from "react";
import { prisma } from "@/lib/prisma";
import { ApostilaCard } from "@/components/public/apostila-card";
import { FilterSidebar } from "@/components/public/filter-sidebar";
import { Pagination } from "@/components/public/pagination";
import { EmptyState } from "@/components/public/empty-state";
import { HeroSearch } from "@/components/public/hero-search";
import { Search } from "lucide-react";

export const dynamic = 'force-dynamic';

const PER_PAGE = 12;

interface SearchPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export async function generateMetadata({
  searchParams,
}: SearchPageProps): Promise<Metadata> {
  const sp = await searchParams;
  const q = typeof sp.q === "string" ? sp.q : "";
  return {
    title: q ? `Busca: "${q}"` : "Busca de Apostilas",
    description: `Resultados de busca por apostilas de concursos públicos${q ? ` para "${q}"` : ""}.`,
    robots: { index: false, follow: true },
  };
}

async function SearchResults({
  q,
  estado,
  banca,
  categoria,
  nivel,
  area,
  page,
}: {
  q: string;
  estado: string;
  banca: string;
  categoria: string;
  nivel: string;
  area: string;
  page: number;
}) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const where: any = {
    status: "PUBLICADO",
    ...(q && {
      OR: [
        { titulo: { contains: q, mode: "insensitive" } },
        { descricaoCurta: { contains: q, mode: "insensitive" } },
        { cargo: { contains: q, mode: "insensitive" } },
        { orgao: { nome: { contains: q, mode: "insensitive" } } },
        { banca: { nome: { contains: q, mode: "insensitive" } } },
      ],
    }),
    ...(estado && { estado }),
    ...(banca && { banca: { slug: banca } }),
    ...(categoria && { categoria: { slug: categoria } }),
    ...(nivel && { nivel: nivel as "FUNDAMENTAL" | "MEDIO" | "TECNICO" | "SUPERIOR" }),
    ...(area && { area: { contains: area, mode: "insensitive" } }),
  };

  const [apostilas, total] = await Promise.all([
    prisma.apostila.findMany({
      where,
      include: { categoria: true, banca: true, orgao: true },
      orderBy: { createdAt: "desc" },
      take: PER_PAGE,
      skip: (page - 1) * PER_PAGE,
    }),
    prisma.apostila.count({ where }),
  ]);

  const totalPages = Math.ceil(total / PER_PAGE);

  const [bancaOpts, catOpts] = await Promise.all([
    prisma.banca.findMany({
      orderBy: { nome: "asc" },
      include: { _count: { select: { apostilas: { where: { status: "PUBLICADO" } } } } },
    }),
    prisma.categoria.findMany({
      where: { ativo: true },
      orderBy: { nome: "asc" },
      include: { _count: { select: { apostilas: { where: { status: "PUBLICADO" } } } } },
    }),
  ]);

  const searchParamsForFilter: Record<string, string> = {};
  if (q) searchParamsForFilter.q = q;
  if (estado) searchParamsForFilter.estado = estado;
  if (banca) searchParamsForFilter.banca = banca;
  if (categoria) searchParamsForFilter.categoria = categoria;
  if (nivel) searchParamsForFilter.nivel = nivel;
  if (area) searchParamsForFilter.area = area;

  return (
    <div className="flex flex-col gap-4 lg:flex-row lg:items-start">
      {/* Sidebar — full width on mobile (above results), fixed width on desktop */}
      <aside className="w-full lg:w-72 lg:flex-shrink-0">
        <FilterSidebar
          bancas={bancaOpts.map((b) => ({
            value: b.slug,
            label: b.nome,
            count: b._count.apostilas,
          }))}
          categorias={catOpts.map((c) => ({
            value: c.slug,
            label: c.nome,
            count: c._count.apostilas,
          }))}
          totalResults={total}
        />
      </aside>

      {/* Results */}
      <div className="flex-1 min-w-0">
        {/* Results header */}
        <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600 sm:text-base">
              <span className="font-bold text-gray-900">{total}</span>{" "}
              resultado{total !== 1 ? "s" : ""} encontrado{total !== 1 ? "s" : ""}
              {q && (
                <>
                  {" "}para{" "}
                  <span className="font-semibold text-brand-blue">
                    &quot;{q}&quot;
                  </span>
                </>
              )}
            </p>
          </div>
          {totalPages > 1 && (
            <p className="text-sm text-gray-400">
              Página {page} de {totalPages}
            </p>
          )}
        </div>

        {apostilas.length > 0 ? (
          <>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {apostilas.map((a) => (
                <ApostilaCard key={a.id} apostila={a} />
              ))}
            </div>
            <div className="mt-8 flex justify-center">
              <Pagination
                currentPage={page}
                totalPages={totalPages}
                baseUrl="/busca"
                searchParams={searchParamsForFilter}
              />
            </div>
          </>
        ) : (
          <EmptyState
            title="Nenhuma apostila encontrada"
            description={
              q
                ? `Não encontramos apostilas para "${q}". Tente outros termos ou ajuste os filtros.`
                : "Nenhuma apostila corresponde aos filtros selecionados."
            }
            action={{ label: "Ver todas as apostilas", href: "/busca" }}
          />
        )}
      </div>
    </div>
  );
}

export default async function BuscaPage({ searchParams }: SearchPageProps) {
  const sp = await searchParams;
  const q = typeof sp.q === "string" ? sp.q : "";
  const estado = typeof sp.estado === "string" ? sp.estado : "";
  const banca = typeof sp.banca === "string" ? sp.banca : "";
  const categoria = typeof sp.categoria === "string" ? sp.categoria : "";
  const nivel = typeof sp.nivel === "string" ? sp.nivel : "";
  const area = typeof sp.area === "string" ? sp.area : "";
  const page = Math.max(1, Number(sp.page ?? 1));

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Search bar header */}
      <div className="bg-brand-blue py-6 sm:py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-3">
            <Search className="h-4 w-4 text-white/60 sm:h-5 sm:w-5" />
            <h1 className="text-base font-semibold text-white sm:text-lg">
              {q ? `Resultados para "${q}"` : "Busca de Apostilas"}
            </h1>
          </div>
          <div className="max-w-2xl">
            <HeroSearch defaultValue={q} />
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-6 sm:py-8 sm:px-6 lg:px-8">
        <Suspense
          fallback={
            <div className="flex items-center justify-center py-20">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-blue border-t-transparent" />
            </div>
          }
        >
          <SearchResults
            q={q}
            estado={estado}
            banca={banca}
            categoria={categoria}
            nivel={nivel}
            area={area}
            page={page}
          />
        </Suspense>
      </div>
    </div>
  );
}
