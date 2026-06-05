import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { ApostilaCard } from "@/components/public/apostila-card";
import { Breadcrumbs } from "@/components/public/breadcrumbs";
import { Pagination } from "@/components/public/pagination";
import { HeroSearch } from "@/components/public/hero-search";
import {
  BookOpen,
  Filter,
  ArrowRight,
  LayoutGrid,
  MapPin,
  Building2,
  Tag,
} from "lucide-react";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Apostilas para Concursos Públicos",
  description:
    "Encontre apostilas atualizadas para concursos públicos federais, estaduais e municipais. Materiais organizados por categoria, estado e banca examinadora.",
  alternates: {
    canonical: "/apostilas",
  },
  openGraph: {
    title: "Apostilas para Concursos Públicos",
    description:
      "Materiais completos e atualizados para sua aprovação em concursos públicos.",
    type: "website",
  },
};

const PER_PAGE = 12;

const estados = [
  "AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA",
  "MT", "MS", "MG", "PA", "PB", "PR", "PE", "PI", "RJ", "RN",
  "RS", "RO", "RR", "SC", "SP", "SE", "TO",
];

interface ApostilasPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

async function getData(params: {
  q: string;
  estado: string;
  banca: string;
  categoria: string;
  page: number;
}) {
  const { q, estado, banca, categoria, page } = params;

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
  };

  const [apostilas, total, featured, categorias, bancas] = await Promise.all([
    prisma.apostila.findMany({
      where,
      include: { categoria: true, banca: true, orgao: true },
      orderBy: { createdAt: "desc" },
      take: PER_PAGE,
      skip: (page - 1) * PER_PAGE,
    }),
    prisma.apostila.count({ where }),
    prisma.apostila.findMany({
      where: { status: "PUBLICADO" },
      include: { categoria: true, banca: true, orgao: true },
      orderBy: { createdAt: "desc" },
      take: 4,
    }),
    prisma.categoria.findMany({
      where: { ativo: true },
      orderBy: { ordem: "asc" },
      include: {
        _count: { select: { apostilas: { where: { status: "PUBLICADO" } } } },
      },
    }),
    prisma.banca.findMany({
      orderBy: { nome: "asc" },
      include: {
        _count: { select: { apostilas: { where: { status: "PUBLICADO" } } } },
      },
    }),
  ]);

  return { apostilas, total, featured, categorias, bancas };
}

export default async function ApostilasPage({ searchParams }: ApostilasPageProps) {
  const sp = await searchParams;
  const q = typeof sp.q === "string" ? sp.q : "";
  const estado = typeof sp.estado === "string" ? sp.estado : "";
  const banca = typeof sp.banca === "string" ? sp.banca : "";
  const categoria = typeof sp.categoria === "string" ? sp.categoria : "";
  const page = Math.max(1, Number(sp.page ?? 1));

  const isFiltered = !!(q || estado || banca || categoria);

  let data = { apostilas: [], total: 0, featured: [], categorias: [], bancas: [] } as Awaited<ReturnType<typeof getData>>;
  try {
    data = await getData({ q, estado, banca, categoria, page });
  } catch {
    // fallback to empty
  }

  const { apostilas, total, featured, categorias, bancas } = data;
  const totalPages = Math.ceil(total / PER_PAGE);

  const currentSearchParams: Record<string, string> = {};
  if (q) currentSearchParams.q = q;
  if (estado) currentSearchParams.estado = estado;
  if (banca) currentSearchParams.banca = banca;
  if (categoria) currentSearchParams.categoria = categoria;

  return (
    <div className="min-h-screen">
      {/* ===== HERO ===== */}
      <section className="bg-brand-blue relative overflow-hidden">
        {/* Background decorations */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-32 -right-32 h-80 w-80 rounded-full bg-brand-gold/5" />
          <div className="absolute bottom-0 -left-16 h-56 w-56 rounded-full bg-white/3" />
          <div className="absolute top-1/2 right-1/4 h-40 w-40 rounded-full bg-brand-gold/5" />
          {/* Subtle grid pattern */}
          <div
            className="absolute inset-0 opacity-5"
            style={{
              backgroundImage:
                "repeating-linear-gradient(0deg, transparent, transparent 40px, rgba(255,255,255,0.3) 40px, rgba(255,255,255,0.3) 41px), repeating-linear-gradient(90deg, transparent, transparent 40px, rgba(255,255,255,0.3) 40px, rgba(255,255,255,0.3) 41px)",
            }}
          />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-16 lg:px-8 lg:py-24">
          {/* Breadcrumbs */}
          <div className="mb-8">
            <Breadcrumbs items={[{ label: "Apostilas" }]} />
          </div>

          <div className="mx-auto max-w-3xl text-center">
            {/* Eyebrow */}
            <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-brand-gold/15 border border-brand-gold/30 px-4 py-1.5 text-sm text-brand-gold">
              <BookOpen className="h-3.5 w-3.5" />
              Materiais atualizados para 2025/2026
            </div>

            {/* Headline */}
            <h1 className="mb-4 text-3xl font-bold leading-tight text-white sm:text-5xl lg:text-6xl">
              Apostilas para{" "}
              <span className="text-brand-gold">Concursos Públicos</span>
            </h1>

            {/* Subheadline */}
            <p className="mb-8 text-lg leading-relaxed text-white/65 sm:text-xl">
              Encontre o material ideal para sua preparação. Apostilas
              organizadas por categoria, estado e banca examinadora.
            </p>

            {/* Search */}
            <div className="mx-auto max-w-2xl">
              <HeroSearch
                size="large"
                placeholder="Busque por concurso, órgão, cargo ou banca..."
                defaultValue={q}
              />
            </div>

            {/* Quick stats */}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-sm text-white/50">
              <span className="flex items-center gap-1.5">
                <Tag className="h-3.5 w-3.5 text-brand-gold/70" />
                {categorias.length} categorias
              </span>
              <span className="h-1 w-1 rounded-full bg-white/20" />
              <span className="flex items-center gap-1.5">
                <Building2 className="h-3.5 w-3.5 text-brand-gold/70" />
                {bancas.length} bancas
              </span>
              <span className="h-1 w-1 rounded-full bg-white/20" />
              <span className="flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5 text-brand-gold/70" />
                Todos os estados
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ===== FEATURED (only when no filters active) ===== */}
      {!isFiltered && featured.length > 0 && (
        <section className="py-14 bg-white border-b border-gray-100">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
              <div>
                <span className="mb-1 block text-xs font-semibold uppercase tracking-widest text-brand-gold">
                  Seleção especial
                </span>
                <h2 className="text-2xl font-bold text-gray-900">
                  Apostilas em Destaque
                </h2>
                <p className="mt-1 text-gray-500 text-sm">
                  Os materiais mais completos para os concursos em aberto
                </p>
              </div>
              <Link
                href="/apostilas"
                className="flex items-center gap-1.5 text-sm font-semibold text-brand-blue hover:text-brand-gold transition-colors"
              >
                Ver todas
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {featured.map((apostila) => (
                <ApostilaCard key={apostila.id} apostila={apostila} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ===== FILTERS + RESULTS ===== */}
      <section className="py-12 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-start">

            {/* ===== SIDEBAR FILTERS ===== */}
            <aside className="w-full lg:w-72 lg:flex-shrink-0">
              <div className="rounded-xl border border-gray-200 bg-white overflow-hidden shadow-sm lg:sticky lg:top-4">
                {/* Filter header */}
                <div className="flex items-center gap-2 px-5 py-4 bg-brand-blue">
                  <Filter className="h-4 w-4 text-brand-gold" />
                  <span className="font-semibold text-white">Filtrar apostilas</span>
                </div>

                <div className="p-5 space-y-6">
                  {/* Active filters */}
                  {isFiltered && (
                    <div className="flex flex-wrap gap-2">
                      {q && (
                        <Link
                          href={`/apostilas?${new URLSearchParams({ ...(estado && { estado }), ...(banca && { banca }), ...(categoria && { categoria }) }).toString()}`}
                          className="inline-flex items-center gap-1 rounded-full bg-brand-gold/10 border border-brand-gold/30 px-2.5 py-1 text-xs font-medium text-brand-gold hover:bg-brand-gold/20 transition-colors"
                        >
                          Busca: {q} &times;
                        </Link>
                      )}
                      {estado && (
                        <Link
                          href={`/apostilas?${new URLSearchParams({ ...(q && { q }), ...(banca && { banca }), ...(categoria && { categoria }) }).toString()}`}
                          className="inline-flex items-center gap-1 rounded-full bg-brand-gold/10 border border-brand-gold/30 px-2.5 py-1 text-xs font-medium text-brand-gold hover:bg-brand-gold/20 transition-colors"
                        >
                          Estado: {estado} &times;
                        </Link>
                      )}
                      {banca && (
                        <Link
                          href={`/apostilas?${new URLSearchParams({ ...(q && { q }), ...(estado && { estado }), ...(categoria && { categoria }) }).toString()}`}
                          className="inline-flex items-center gap-1 rounded-full bg-brand-gold/10 border border-brand-gold/30 px-2.5 py-1 text-xs font-medium text-brand-gold hover:bg-brand-gold/20 transition-colors"
                        >
                          Banca &times;
                        </Link>
                      )}
                      {categoria && (
                        <Link
                          href={`/apostilas?${new URLSearchParams({ ...(q && { q }), ...(estado && { estado }), ...(banca && { banca }) }).toString()}`}
                          className="inline-flex items-center gap-1 rounded-full bg-brand-gold/10 border border-brand-gold/30 px-2.5 py-1 text-xs font-medium text-brand-gold hover:bg-brand-gold/20 transition-colors"
                        >
                          Categoria &times;
                        </Link>
                      )}
                      <Link
                        href="/apostilas"
                        className="inline-flex items-center gap-1 rounded-full bg-red-50 border border-red-200 px-2.5 py-1 text-xs font-medium text-red-600 hover:bg-red-100 transition-colors"
                      >
                        Limpar tudo
                      </Link>
                    </div>
                  )}

                  {/* Categoria */}
                  {categorias.length > 0 && (
                    <div>
                      <h3 className="mb-3 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-gray-500">
                        <Tag className="h-3 w-3" />
                        Categoria
                      </h3>
                      <div className="flex flex-col gap-1 max-h-52 overflow-y-auto pr-1">
                        {categorias.map((cat) => {
                          const isActive = categoria === cat.slug;
                          const params = new URLSearchParams({
                            ...(q && { q }),
                            ...(estado && { estado }),
                            ...(banca && { banca }),
                            ...(!isActive && { categoria: cat.slug }),
                          });
                          return (
                            <Link
                              key={cat.id}
                              href={`/apostilas?${params.toString()}`}
                              className={`flex items-center justify-between rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                                isActive
                                  ? "bg-brand-blue text-white"
                                  : "bg-gray-50 text-gray-700 hover:bg-gray-100"
                              }`}
                            >
                              <span>{cat.nome}</span>
                              <span
                                className={`text-xs ${isActive ? "text-white/70" : "text-gray-400"}`}
                              >
                                {cat._count.apostilas}
                              </span>
                            </Link>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Estado */}
                  <div>
                    <h3 className="mb-3 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-gray-500">
                      <MapPin className="h-3 w-3" />
                      Estado
                    </h3>
                    <div className="grid grid-cols-3 gap-1.5">
                      {estados.map((uf) => {
                        const isActive = estado === uf;
                        const params = new URLSearchParams({
                          ...(q && { q }),
                          ...(banca && { banca }),
                          ...(categoria && { categoria }),
                          ...(!isActive && { estado: uf }),
                        });
                        return (
                          <Link
                            key={uf}
                            href={`/apostilas?${params.toString()}`}
                            className={`rounded-lg px-2 py-1.5 text-center text-xs font-medium transition-colors ${
                              isActive
                                ? "bg-brand-blue text-white"
                                : "bg-gray-50 text-gray-700 hover:bg-gray-100"
                            }`}
                          >
                            {uf}
                          </Link>
                        );
                      })}
                    </div>
                  </div>

                  {/* Banca */}
                  {bancas.filter((b) => b._count.apostilas > 0).length > 0 && (
                    <div>
                      <h3 className="mb-3 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-gray-500">
                        <Building2 className="h-3 w-3" />
                        Banca
                      </h3>
                      <div className="flex flex-col gap-1 max-h-48 overflow-y-auto pr-1">
                        {bancas
                          .filter((b) => b._count.apostilas > 0)
                          .map((b) => {
                            const isActive = banca === b.slug;
                            const params = new URLSearchParams({
                              ...(q && { q }),
                              ...(estado && { estado }),
                              ...(categoria && { categoria }),
                              ...(!isActive && { banca: b.slug }),
                            });
                            return (
                              <Link
                                key={b.id}
                                href={`/apostilas?${params.toString()}`}
                                className={`flex items-center justify-between rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                                  isActive
                                    ? "bg-brand-blue text-white"
                                    : "bg-gray-50 text-gray-700 hover:bg-gray-100"
                                }`}
                              >
                                <span>{b.nome}</span>
                                <span
                                  className={`text-xs ${isActive ? "text-white/70" : "text-gray-400"}`}
                                >
                                  {b._count.apostilas}
                                </span>
                              </Link>
                            );
                          })}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </aside>

            {/* ===== RESULTS ===== */}
            <div className="flex-1 min-w-0">
              {/* Results header */}
              <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-2">
                  <LayoutGrid className="h-4 w-4 text-gray-400" />
                  <p className="text-gray-600 text-sm font-medium">
                    <span className="font-semibold text-gray-900">{total}</span>{" "}
                    apostila{total !== 1 ? "s" : ""} encontrada{total !== 1 ? "s" : ""}
                    {q && (
                      <>
                        {" "}para{" "}
                        <span className="font-semibold text-brand-blue">
                          &quot;{q}&quot;
                        </span>
                      </>
                    )}
                    {estado && (
                      <>
                        {" "}em{" "}
                        <span className="font-semibold text-brand-blue">{estado}</span>
                      </>
                    )}
                  </p>
                </div>
                {totalPages > 1 && (
                  <p className="text-xs text-gray-400">
                    Página {page} de {totalPages}
                  </p>
                )}
              </div>

              {apostilas.length > 0 ? (
                <>
                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
                    {apostilas.map((apostila) => (
                      <ApostilaCard key={apostila.id} apostila={apostila} />
                    ))}
                  </div>
                  <div className="mt-10 flex justify-center">
                    <Pagination
                      currentPage={page}
                      totalPages={totalPages}
                      baseUrl="/apostilas"
                      searchParams={currentSearchParams}
                    />
                  </div>
                </>
              ) : (
                <div className="rounded-xl border border-dashed border-gray-300 bg-white py-20 text-center">
                  <BookOpen className="mx-auto mb-4 h-12 w-12 text-gray-200" />
                  <h3 className="mb-2 text-lg font-semibold text-gray-700">
                    Nenhuma apostila encontrada
                  </h3>
                  <p className="mb-6 text-sm text-gray-400 max-w-xs mx-auto">
                    {isFiltered
                      ? "Tente remover alguns filtros ou buscar por outros termos."
                      : "Em breve novos materiais por aqui."}
                  </p>
                  {isFiltered && (
                    <Link
                      href="/apostilas"
                      className="inline-flex items-center gap-2 rounded-lg bg-brand-gold px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-gold-dark transition-colors"
                    >
                      Limpar filtros
                    </Link>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ===== BOTTOM CTA ===== */}
      <section className="py-14 bg-brand-blue">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="mb-3 text-2xl font-bold text-white sm:text-3xl">
            Não encontrou o que procura?
          </h2>
          <p className="mb-8 text-white/60">
            Explore por categorias ou use a busca avançada para refinar sua pesquisa.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/categorias"
              className="inline-flex items-center gap-2 rounded-lg bg-brand-gold px-6 py-3 text-sm font-bold text-white shadow-lg hover:bg-brand-gold-dark transition-colors"
            >
              Ver categorias
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/busca"
              className="inline-flex items-center gap-2 rounded-lg border border-white/30 px-6 py-3 text-sm font-semibold text-white hover:bg-white/10 transition-colors"
            >
              Busca avançada
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
