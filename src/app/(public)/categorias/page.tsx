import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Breadcrumbs } from "@/components/public/breadcrumbs";
import {
  Building,
  Flag,
  Globe,
  Heart,
  GraduationCap,
  Shield,
  Scale,
  MapPin,
  Briefcase,
  Calculator,
  Landmark,
  Gavel,
  BookOpen,
  TrendingUp,
  ArrowRight,
  Tag,
  ChevronRight,
  type LucideIcon,
} from "lucide-react";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Categorias de Concursos Públicos",
  description:
    "Explore apostilas para concursos públicos por categoria: federal, estadual, municipal, saúde, educação, tribunais e muito mais. Encontre o material certo para a sua área.",
  alternates: {
    canonical: "/categorias",
  },
  openGraph: {
    title: "Categorias de Concursos Públicos",
    description:
      "Todas as categorias de concursos públicos em um só lugar. Encontre apostilas pela sua área de atuação.",
    type: "website",
  },
};

const categoryIconMap: Record<string, LucideIcon> = {
  municipal: MapPin,
  estadual: Flag,
  federal: Globe,
  saude: Heart,
  educacao: GraduationCap,
  seguranca: Shield,
  tribunais: Scale,
  prefeituras: Building,
  fiscal: Calculator,
  administrativo: Briefcase,
  judiciario: Gavel,
  legislativo: Landmark,
  policia: Shield,
};

const categoryColorMap: Record<
  string,
  { bg: string; icon: string; border: string; hoverBg: string }
> = {
  federal: {
    bg: "bg-indigo-50",
    icon: "text-indigo-600",
    border: "border-indigo-100",
    hoverBg: "group-hover:bg-indigo-100",
  },
  estadual: {
    bg: "bg-blue-50",
    icon: "text-blue-600",
    border: "border-blue-100",
    hoverBg: "group-hover:bg-blue-100",
  },
  municipal: {
    bg: "bg-cyan-50",
    icon: "text-cyan-600",
    border: "border-cyan-100",
    hoverBg: "group-hover:bg-cyan-100",
  },
  saude: {
    bg: "bg-red-50",
    icon: "text-red-500",
    border: "border-red-100",
    hoverBg: "group-hover:bg-red-100",
  },
  educacao: {
    bg: "bg-amber-50",
    icon: "text-amber-600",
    border: "border-amber-100",
    hoverBg: "group-hover:bg-amber-100",
  },
  seguranca: {
    bg: "bg-slate-50",
    icon: "text-slate-600",
    border: "border-slate-100",
    hoverBg: "group-hover:bg-slate-100",
  },
  tribunais: {
    bg: "bg-emerald-50",
    icon: "text-emerald-600",
    border: "border-emerald-100",
    hoverBg: "group-hover:bg-emerald-100",
  },
  prefeituras: {
    bg: "bg-teal-50",
    icon: "text-teal-600",
    border: "border-teal-100",
    hoverBg: "group-hover:bg-teal-100",
  },
  fiscal: {
    bg: "bg-orange-50",
    icon: "text-orange-600",
    border: "border-orange-100",
    hoverBg: "group-hover:bg-orange-100",
  },
  administrativo: {
    bg: "bg-violet-50",
    icon: "text-violet-600",
    border: "border-violet-100",
    hoverBg: "group-hover:bg-violet-100",
  },
};

const defaultColors = {
  bg: "bg-gray-50",
  icon: "text-gray-500",
  border: "border-gray-100",
  hoverBg: "group-hover:bg-gray-100",
};

const areaDescriptions = [
  {
    icon: Globe,
    title: "Concursos Federais",
    description:
      "Ministérios, autarquias, agências reguladoras e demais órgãos da administração federal direta e indireta.",
    color: "text-indigo-600",
    bg: "bg-indigo-50",
  },
  {
    icon: Flag,
    title: "Concursos Estaduais",
    description:
      "Secretarias, tribunais estaduais, assembleias legislativas e órgãos vinculados aos governos estaduais.",
    color: "text-blue-600",
    bg: "bg-blue-50",
  },
  {
    icon: Building,
    title: "Concursos Municipais",
    description:
      "Prefeituras, câmaras municipais e órgãos ligados às administrações municipais de todo o Brasil.",
    color: "text-cyan-600",
    bg: "bg-cyan-50",
  },
  {
    icon: Scale,
    title: "Poder Judiciário",
    description:
      "Tribunais de Justiça, TRF, TRT, TST, STF e demais órgãos do poder judiciário.",
    color: "text-emerald-600",
    bg: "bg-emerald-50",
  },
];

async function getCategories() {
  try {
    return await prisma.categoria.findMany({
      where: { ativo: true },
      orderBy: { ordem: "asc" },
      include: {
        _count: { select: { apostilas: { where: { status: "PUBLICADO" } } } },
      },
    });
  } catch {
    return [];
  }
}

export default async function CategoriasPage() {
  const categorias = await getCategories();

  const totalApostilas = categorias.reduce(
    (sum, cat) => sum + cat._count.apostilas,
    0
  );

  return (
    <div className="min-h-screen">
      {/* ===== HERO ===== */}
      <section className="bg-brand-blue relative overflow-hidden">
        {/* Decorations */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-brand-gold/5" />
          <div className="absolute bottom-0 left-1/3 h-48 w-48 rounded-full bg-white/3" />
          <div
            className="absolute inset-0 opacity-4"
            style={{
              backgroundImage:
                "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.15) 1px, transparent 0)",
              backgroundSize: "32px 32px",
            }}
          />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-16 lg:px-8 lg:py-24">
          {/* Breadcrumbs */}
          <div className="mb-8">
            <Breadcrumbs items={[{ label: "Categorias" }]} />
          </div>

          <div className="mx-auto max-w-3xl text-center">
            {/* Eyebrow */}
            <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-brand-gold/15 border border-brand-gold/30 px-4 py-1.5 text-sm text-brand-gold">
              <Tag className="h-3.5 w-3.5" />
              Todas as áreas do conhecimento
            </div>

            <h1 className="mb-4 text-3xl font-bold leading-tight text-white sm:text-5xl lg:text-6xl">
              Categorias de{" "}
              <span className="text-brand-gold">Concursos</span>
            </h1>
            <p className="mb-8 text-lg leading-relaxed text-white/65 sm:text-xl">
              Explore nosso acervo de apostilas organizado por área de atuação.
              Encontre o material perfeito para o seu concurso.
            </p>

            {/* Stats pills */}
            <div className="flex flex-wrap items-center justify-center gap-4">
              <div className="flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm">
                <Tag className="h-4 w-4 text-brand-gold" />
                <span className="font-semibold text-white">{categorias.length}</span>
                <span className="text-white/60">categorias</span>
              </div>
              <div className="flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm">
                <BookOpen className="h-4 w-4 text-brand-gold" />
                <span className="font-semibold text-white">{totalApostilas}</span>
                <span className="text-white/60">apostilas</span>
              </div>
              <div className="flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm">
                <TrendingUp className="h-4 w-4 text-brand-gold" />
                <span className="text-white/60">Atualizadas em 2025</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== AREAS EXPLANATION ===== */}
      <section className="py-10 bg-white border-b border-gray-100 sm:py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8 text-center sm:mb-10">
            <span className="mb-2 block text-xs font-semibold uppercase tracking-widest text-brand-gold">
              Entenda as áreas
            </span>
            <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">
              Principais esferas dos concursos
            </h2>
            <p className="mt-3 text-gray-500 max-w-xl mx-auto">
              Os concursos públicos brasileiros se organizam em diferentes esferas
              de governo. Saiba qual é a sua área de interesse.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {areaDescriptions.map((area) => {
              const Icon = area.icon;
              return (
                <div
                  key={area.title}
                  className="rounded-xl border border-gray-100 p-4 text-center bg-gray-50 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 sm:p-6"
                >
                  <div
                    className={`mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl ${area.bg}`}
                  >
                    <Icon className={`h-7 w-7 ${area.color}`} />
                  </div>
                  <h3 className="mb-2 font-bold text-gray-900">{area.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">
                    {area.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ===== CATEGORIES GRID ===== */}
      <section className="py-16 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-10 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <span className="mb-1 block text-xs font-semibold uppercase tracking-widest text-brand-gold">
                Navegue por área
              </span>
              <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">
                Todas as Categorias
              </h2>
              <p className="mt-2 text-gray-500">
                Clique em uma categoria para ver todas as apostilas disponíveis
              </p>
            </div>
            <Link
              href="/busca"
              className="flex items-center gap-1.5 text-sm font-semibold text-brand-blue hover:text-brand-gold transition-colors"
            >
              Busca avançada
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {categorias.length > 0 ? (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 sm:gap-5">
              {categorias.map((cat) => {
                const iconKey = cat.slug.toLowerCase().split("-")[0];
                const Icon = categoryIconMap[iconKey] ?? BookOpen;
                const colors = categoryColorMap[iconKey] ?? defaultColors;

                return (
                  <Link
                    key={cat.id}
                    href={`/categorias/${cat.slug}`}
                    className="group relative flex flex-col rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition-all duration-200 hover:shadow-lg hover:-translate-y-1 hover:border-brand-gold/40 overflow-hidden sm:p-6"
                  >
                    {/* Gold accent bar on hover */}
                    <div className="absolute top-0 left-0 right-0 h-0.5 bg-brand-gold scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />

                    <div className="flex items-start gap-4 mb-4">
                      <div
                        className={`flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl ${colors.bg} ${colors.hoverBg} transition-colors`}
                      >
                        <Icon className={`h-6 w-6 ${colors.icon}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-gray-900 group-hover:text-brand-blue transition-colors leading-snug">
                          {cat.nome}
                        </h3>
                        <span className="text-xs font-medium text-gray-400">
                          {cat._count.apostilas}{" "}
                          {cat._count.apostilas === 1 ? "apostila" : "apostilas"}
                        </span>
                      </div>
                    </div>

                    {cat.descricao && (
                      <p className="text-sm text-gray-500 leading-relaxed line-clamp-2 flex-1">
                        {cat.descricao}
                      </p>
                    )}

                    <div className="mt-4 flex items-center justify-between pt-4 border-t border-gray-100">
                      <span className="text-xs font-semibold text-brand-gold opacity-0 group-hover:opacity-100 transition-opacity">
                        Ver apostilas
                      </span>
                      <ChevronRight className="h-4 w-4 text-gray-300 group-hover:text-brand-gold group-hover:translate-x-1 transition-all duration-200" />
                    </div>
                  </Link>
                );
              })}
            </div>
          ) : (
            /* Fallback: show placeholder cards */
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 sm:gap-5">
              {[
                { nome: "Federal", slug: "federal", Icon: Globe },
                { nome: "Estadual", slug: "estadual", Icon: Flag },
                { nome: "Municipal", slug: "municipal", Icon: MapPin },
                { nome: "Saúde", slug: "saude", Icon: Heart },
                { nome: "Educação", slug: "educacao", Icon: GraduationCap },
                { nome: "Segurança Pública", slug: "seguranca", Icon: Shield },
                { nome: "Tribunais", slug: "tribunais", Icon: Scale },
                { nome: "Prefeituras", slug: "prefeituras", Icon: Building },
              ].map(({ nome, slug, Icon }) => {
                const colors = categoryColorMap[slug] ?? defaultColors;
                return (
                  <Link
                    key={slug}
                    href={`/categorias/${slug}`}
                    className="group flex flex-col items-center rounded-xl border border-gray-200 bg-white p-4 text-center shadow-sm transition-all duration-200 hover:shadow-md hover:-translate-y-1 hover:border-brand-gold/40 sm:p-6"
                  >
                    <div
                      className={`mb-4 flex h-14 w-14 items-center justify-center rounded-2xl ${colors.bg} ${colors.hoverBg} transition-colors`}
                    >
                      <Icon className={`h-7 w-7 ${colors.icon}`} />
                    </div>
                    <h3 className="font-bold text-gray-900 group-hover:text-brand-blue transition-colors">
                      {nome}
                    </h3>
                    <ChevronRight className="mt-3 h-4 w-4 text-gray-300 group-hover:text-brand-gold transition-colors" />
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* ===== CTA BANNER ===== */}
      <section className="py-16 bg-brand-blue">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-2xl bg-white/5 border border-white/10 p-10 text-center">
            {/* Decorative blobs */}
            <div className="absolute -top-8 -right-8 h-32 w-32 rounded-full bg-brand-gold/10 blur-2xl" />
            <div className="absolute -bottom-8 -left-8 h-32 w-32 rounded-full bg-brand-gold/10 blur-2xl" />

            <div className="relative">
              <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-gold/15">
                <BookOpen className="h-7 w-7 text-brand-gold" />
              </div>
              <h2 className="mb-3 text-2xl font-bold text-white sm:text-3xl">
                Não sabe por onde começar?
              </h2>
              <p className="mb-8 text-white/60 max-w-lg mx-auto">
                Use nossa busca inteligente para encontrar apostilas pelo nome do
                concurso, órgão, cargo ou banca examinadora.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-4">
                <Link
                  href="/busca"
                  className="inline-flex items-center gap-2 rounded-lg bg-brand-gold px-7 py-3.5 text-sm font-bold text-white shadow-lg hover:bg-brand-gold-dark transition-colors"
                >
                  Buscar apostilas
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/apostilas"
                  className="inline-flex items-center gap-2 rounded-lg border border-white/30 px-7 py-3.5 text-sm font-semibold text-white hover:bg-white/10 transition-colors"
                >
                  Ver todas as apostilas
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
