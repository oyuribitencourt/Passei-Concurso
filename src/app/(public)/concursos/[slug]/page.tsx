import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  MapPin,
  Building2,
  FileText,
  Calendar,
  GraduationCap,
  ExternalLink,
  ArrowRight,
} from "lucide-react";
import { prisma } from "@/lib/prisma";
import { ApostilaCard } from "@/components/public/apostila-card";
import { Breadcrumbs } from "@/components/public/breadcrumbs";
import { EmptyState } from "@/components/public/empty-state";

export const dynamic = 'force-dynamic';

interface ConcursoPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: ConcursoPageProps): Promise<Metadata> {
  const { slug } = await params;
  try {
    const concurso = await prisma.concurso.findUnique({
      where: { slug },
      include: { orgao: true },
    });
    if (!concurso) return { title: "Concurso não encontrado" };
    return {
      title: `Apostilas para ${concurso.nome}`,
      description: `Encontre apostilas e materiais de estudo para o concurso ${concurso.nome}${concurso.orgao ? ` - ${concurso.orgao.nome}` : ""}. Conteúdo atualizado e alinhado ao edital.`,
    };
  } catch {
    return { title: "Concurso" };
  }
}

const statusLabel: Record<string, { label: string; className: string }> = {
  ABERTO: { label: "Inscrições Abertas", className: "bg-green-100 text-green-800" },
  EM_ANDAMENTO: { label: "Em Andamento", className: "bg-blue-100 text-blue-800" },
  ENCERRADO: { label: "Encerrado", className: "bg-gray-100 text-gray-700" },
  PREVISTO: { label: "Previsto", className: "bg-amber-100 text-amber-800" },
  ANULADO: { label: "Anulado", className: "bg-red-100 text-red-800" },
};

const nivelLabel: Record<string, string> = {
  FUNDAMENTAL: "Nível Fundamental",
  MEDIO: "Nível Médio",
  TECNICO: "Nível Técnico",
  SUPERIOR: "Nível Superior",
};

export default async function ConcursoPage({ params }: ConcursoPageProps) {
  const { slug } = await params;

  const concurso = await prisma.concurso.findUnique({
    where: { slug },
    include: {
      orgao: true,
      banca: true,
      apostilas: {
        where: { status: "PUBLICADO" },
        include: { categoria: true, banca: true, orgao: true },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!concurso) notFound();

  const statusInfo = statusLabel[concurso.status] ?? statusLabel["ABERTO"];

  const cargosArr = concurso.cargos
    ? concurso.cargos
        .split("\n")
        .map((c) => c.trim())
        .filter(Boolean)
    : [];

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="bg-brand-blue py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Breadcrumbs
            items={[
              { label: "Concursos", href: "/concursos-novos" },
              { label: concurso.nome },
            ]}
          />
          <div className="mt-6 grid grid-cols-1 gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <div className="mb-4">
                <span
                  className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${statusInfo.className}`}
                >
                  {statusInfo.label}
                </span>
              </div>
              <h1 className="text-3xl font-bold text-white mb-4 sm:text-4xl">
                {concurso.nome}
              </h1>
              {concurso.observacoes && (
                <p className="text-white/70 text-lg leading-relaxed mb-6 max-w-2xl">
                  {concurso.observacoes}
                </p>
              )}

              {/* Meta badges */}
              <div className="flex flex-wrap gap-3">
                {concurso.orgao && (
                  <div className="flex items-center gap-1.5 rounded-lg bg-white/10 px-3 py-2 text-sm text-white/80">
                    <Building2 className="h-4 w-4 text-white/50" />
                    {concurso.orgao.nome}
                  </div>
                )}
                {concurso.banca && (
                  <div className="flex items-center gap-1.5 rounded-lg bg-white/10 px-3 py-2 text-sm text-white/80">
                    <FileText className="h-4 w-4 text-white/50" />
                    {concurso.banca.nome}
                  </div>
                )}
                {concurso.estado && (
                  <div className="flex items-center gap-1.5 rounded-lg bg-white/10 px-3 py-2 text-sm text-white/80">
                    <MapPin className="h-4 w-4 text-white/50" />
                    {concurso.estado}
                    {concurso.cidade ? ` - ${concurso.cidade}` : ""}
                  </div>
                )}
                {concurso.nivel && (
                  <div className="flex items-center gap-1.5 rounded-lg bg-white/10 px-3 py-2 text-sm text-white/80">
                    <GraduationCap className="h-4 w-4 text-white/50" />
                    {nivelLabel[concurso.nivel]}
                  </div>
                )}
                {concurso.ano && (
                  <div className="flex items-center gap-1.5 rounded-lg bg-white/10 px-3 py-2 text-sm text-white/80">
                    <Calendar className="h-4 w-4 text-white/50" />
                    {concurso.ano}
                  </div>
                )}
              </div>
            </div>

            {/* Quick info sidebar */}
            <div className="lg:col-span-1">
              <div className="rounded-2xl bg-white/10 p-6 backdrop-blur-sm">
                <h3 className="font-semibold text-white mb-4">
                  Sobre o concurso
                </h3>
                <div className="flex flex-col gap-3 text-sm text-white/70">
                  {concurso.orgao && (
                    <div>
                      <span className="text-white/40 text-xs uppercase tracking-wider">
                        Órgão
                      </span>
                      <p className="text-white font-medium mt-0.5">
                        {concurso.orgao.nome}
                        {concurso.orgao.sigla
                          ? ` (${concurso.orgao.sigla})`
                          : ""}
                      </p>
                    </div>
                  )}
                  {concurso.banca && (
                    <div>
                      <span className="text-white/40 text-xs uppercase tracking-wider">
                        Banca
                      </span>
                      <p className="text-white font-medium mt-0.5">
                        {concurso.banca.nome}
                      </p>
                    </div>
                  )}
                  {concurso.ano && (
                    <div>
                      <span className="text-white/40 text-xs uppercase tracking-wider">
                        Ano
                      </span>
                      <p className="text-white font-medium mt-0.5">
                        {concurso.ano}
                      </p>
                    </div>
                  )}
                </div>
                {concurso.linkReferencia && (
                  <a
                    href={concurso.linkReferencia}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 flex items-center gap-2 rounded-lg bg-white/15 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-white/25"
                  >
                    <ExternalLink className="h-4 w-4" />
                    Ver edital oficial
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Cargos */}
      {cargosArr.length > 0 && (
        <section className="py-10 bg-white border-b border-gray-100">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Cargos disponíveis
            </h2>
            <div className="flex flex-wrap gap-2">
              {cargosArr.map((cargo, i) => (
                <Link
                  key={i}
                  href={`/apostilas/cargo/${cargo.toLowerCase().replace(/\s+/g, "-")}`}
                  className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-1.5 text-sm text-gray-700 transition-colors hover:bg-brand-blue hover:text-white hover:border-brand-blue"
                >
                  {cargo}
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Related apostilas */}
      <section className="py-12 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">
              Apostilas para este concurso
            </h2>
            {concurso.apostilas.length > 0 && (
              <Link
                href="/busca"
                className="flex items-center gap-1.5 text-sm font-semibold text-brand-blue hover:underline"
              >
                Ver todas
                <ArrowRight className="h-4 w-4" />
              </Link>
            )}
          </div>

          {concurso.apostilas.length > 0 ? (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {concurso.apostilas.map((apostila) => (
                <ApostilaCard key={apostila.id} apostila={apostila} />
              ))}
            </div>
          ) : (
            <EmptyState
              title="Ainda não temos apostilas para este concurso"
              description="Em breve publicaremos materiais. Use a busca para encontrar apostilas relacionadas."
              action={{ label: "Buscar apostilas", href: "/busca" }}
            />
          )}
        </div>
      </section>
    </div>
  );
}
