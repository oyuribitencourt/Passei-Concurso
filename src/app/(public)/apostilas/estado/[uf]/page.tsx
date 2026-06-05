import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { MapPin, ArrowRight } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { ApostilaCard } from "@/components/public/apostila-card";
import { Breadcrumbs } from "@/components/public/breadcrumbs";
import { EmptyState } from "@/components/public/empty-state";

interface EstadoPageProps {
  params: Promise<{ uf: string }>;
}

const estadoNomes: Record<string, string> = {
  AC: "Acre", AL: "Alagoas", AP: "Amapá", AM: "Amazonas", BA: "Bahia",
  CE: "Ceará", DF: "Distrito Federal", ES: "Espírito Santo", GO: "Goiás",
  MA: "Maranhão", MT: "Mato Grosso", MS: "Mato Grosso do Sul",
  MG: "Minas Gerais", PA: "Pará", PB: "Paraíba", PR: "Paraná",
  PE: "Pernambuco", PI: "Piauí", RJ: "Rio de Janeiro", RN: "Rio Grande do Norte",
  RS: "Rio Grande do Sul", RO: "Rondônia", RR: "Roraima", SC: "Santa Catarina",
  SP: "São Paulo", SE: "Sergipe", TO: "Tocantins",
};

const ufsValidas = Object.keys(estadoNomes);

export const dynamic = 'force-dynamic';

export async function generateMetadata({
  params,
}: EstadoPageProps): Promise<Metadata> {
  const { uf } = await params;
  const nome = estadoNomes[uf.toUpperCase()];
  if (!nome) return { title: "Estado não encontrado" };
  return {
    title: `Apostilas para Concursos em ${nome} (${uf.toUpperCase()})`,
    description: `Encontre apostilas para concursos públicos em ${nome}. Materiais organizados por órgão, banca e nível para sua aprovação.`,
  };
}

export default async function EstadoPage({ params }: EstadoPageProps) {
  const { uf } = await params;
  const ufUpper = uf.toUpperCase();
  const nomeEstado = estadoNomes[ufUpper];

  if (!nomeEstado) notFound();

  const apostilas = await prisma.apostila.findMany({
    where: { status: "PUBLICADO", estado: ufUpper },
    include: { categoria: true, banca: true, orgao: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="bg-brand-blue py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Breadcrumbs
            items={[
              { label: "Apostilas", href: "/busca" },
              { label: `Estado: ${ufUpper}` },
            ]}
          />
          <div className="mt-6 max-w-2xl">
            <div className="mb-4 flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/15">
                <MapPin className="h-5 w-5 text-white" />
              </div>
              <span className="text-sm font-medium text-white/60 uppercase tracking-wider">
                Concursos por Estado
              </span>
            </div>
            <h1 className="text-4xl font-bold text-white mb-3">
              Concursos em {nomeEstado}
            </h1>
            <p className="text-white/70 text-lg leading-relaxed">
              Apostilas completas para os concursos públicos do estado de{" "}
              {nomeEstado} ({ufUpper}). Conteúdo organizado e atualizado.
            </p>
            <p className="mt-4 text-white/50 text-sm">
              {apostilas.length}{" "}
              {apostilas.length === 1
                ? "apostila disponível"
                : "apostilas disponíveis"}
            </p>
          </div>
        </div>
      </section>

      {/* Results */}
      <section className="py-12 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {apostilas.length > 0 ? (
            <>
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {apostilas.map((apostila) => (
                  <ApostilaCard key={apostila.id} apostila={apostila} />
                ))}
              </div>
              <div className="mt-12 text-center">
                <Link
                  href="/busca"
                  className="inline-flex items-center gap-2 rounded-lg border border-brand-blue px-6 py-3 text-sm font-semibold text-brand-blue transition-colors hover:bg-brand-blue hover:text-white"
                >
                  Ver todas as apostilas
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </>
          ) : (
            <EmptyState
              title={`Nenhuma apostila para ${nomeEstado} ainda`}
              description="Estamos preparando materiais para este estado. Confira apostilas de outros estados ou use a busca avançada."
              action={{ label: "Buscar apostilas", href: "/busca" }}
            />
          )}
        </div>
      </section>

      {/* Other states */}
      <section className="py-10 bg-white border-t border-gray-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">
            Outros estados
          </h2>
          <div className="flex flex-wrap gap-2">
            {ufsValidas
              .filter((u) => u !== ufUpper)
              .map((u) => (
                <Link
                  key={u}
                  href={`/apostilas/estado/${u}`}
                  className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-1.5 text-sm font-medium text-gray-700 transition-colors hover:bg-brand-blue hover:text-white hover:border-brand-blue"
                >
                  {u}
                </Link>
              ))}
          </div>
        </div>
      </section>
    </div>
  );
}
