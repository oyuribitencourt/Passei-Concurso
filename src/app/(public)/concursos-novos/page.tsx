import type { Metadata } from "next";
import Link from "next/link";
import {
  TrendingUp,
  MapPin,
  Building2,
  Calendar,
  ExternalLink,
  ArrowRight,
  Bell,
} from "lucide-react";
import { prisma } from "@/lib/prisma";
import { ApostilaCard } from "@/components/public/apostila-card";
import { EmptyState } from "@/components/public/empty-state";

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: "Concursos Novos e Oportunidades Recentes",
  description:
    "Fique por dentro das últimas oportunidades de concursos públicos detectadas. Apostilas e materiais para os concursos mais recentes.",
};

const statusLabel: Record<string, { label: string; className: string }> = {
  ABERTO: { label: "Inscrições Abertas", className: "bg-green-100 text-green-800" },
  EM_ANDAMENTO: { label: "Em Andamento", className: "bg-blue-100 text-blue-800" },
  ENCERRADO: { label: "Encerrado", className: "bg-gray-100 text-gray-700" },
  PREVISTO: { label: "Previsto", className: "bg-amber-100 text-amber-800" },
  ANULADO: { label: "Anulado", className: "bg-red-100 text-red-800" },
};

export default async function ConcursosNovosPage() {
  const [recentApostilas, recentConcursos, opportunities] = await Promise.all([
    prisma.apostila.findMany({
      where: { status: "PUBLICADO" },
      include: { categoria: true, banca: true, orgao: true },
      orderBy: { createdAt: "desc" },
      take: 8,
    }),
    prisma.concurso.findMany({
      include: { orgao: true, banca: true },
      orderBy: { createdAt: "desc" },
      take: 6,
      where: {
        status: { in: ["ABERTO", "PREVISTO", "EM_ANDAMENTO"] },
      },
    }),
    prisma.detectedOpportunity.findMany({
      where: { status: "NOVA" },
      orderBy: { createdAt: "desc" },
      take: 10,
    }),
  ]);

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="bg-brand-blue py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <div className="mb-4 flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-gold/20">
                <TrendingUp className="h-5 w-5 text-brand-gold" />
              </div>
              <span className="text-sm font-medium text-white/60 uppercase tracking-wider">
                Novidades
              </span>
            </div>
            <h1 className="text-4xl font-bold text-white mb-3">
              Concursos Novos e Oportunidades
            </h1>
            <p className="text-white/70 text-lg leading-relaxed">
              Fique por dentro dos concursos mais recentes e encontre as
              apostilas ideais para se preparar com antecedencia.
            </p>
          </div>
        </div>
      </section>

      {/* Recent apostilas */}
      <section className="py-12 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                Apostilas Recentes
              </h2>
              <p className="text-gray-500 mt-1">
                Os materiais mais recentemente adicionados à plataforma
              </p>
            </div>
            <Link
              href="/busca"
              className="flex items-center gap-1.5 text-sm font-semibold text-brand-blue hover:underline"
            >
              Ver todas
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {recentApostilas.length > 0 ? (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {recentApostilas.map((apostila) => (
                <ApostilaCard key={apostila.id} apostila={apostila} />
              ))}
            </div>
          ) : (
            <EmptyState
              title="Nenhuma apostila publicada ainda"
              description="Em breve novos materiais serão adicionados."
              icon="file"
            />
          )}
        </div>
      </section>

      {/* Recent concursos */}
      {recentConcursos.length > 0 && (
        <section className="py-12 bg-white border-t border-gray-100">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">
              Concursos em Aberto
            </h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {recentConcursos.map((concurso) => {
                const statusInfo =
                  statusLabel[concurso.status] ?? statusLabel["ABERTO"];
                return (
                  <Link
                    key={concurso.id}
                    href={`/concursos/${concurso.slug}`}
                    className="group rounded-xl border border-gray-200 bg-gray-50 p-5 transition-all hover:shadow-md hover:-translate-y-0.5 hover:border-brand-blue/20"
                  >
                    <div className="mb-3 flex items-start justify-between gap-2">
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${statusInfo.className}`}
                      >
                        {statusInfo.label}
                      </span>
                      {concurso.ano && (
                        <div className="flex items-center gap-1 text-xs text-gray-400">
                          <Calendar className="h-3.5 w-3.5" />
                          {concurso.ano}
                        </div>
                      )}
                    </div>
                    <h3 className="font-semibold text-gray-900 group-hover:text-brand-blue transition-colors leading-snug mb-2">
                      {concurso.nome}
                    </h3>
                    <div className="flex flex-col gap-1 text-xs text-gray-500">
                      {concurso.orgao && (
                        <span className="flex items-center gap-1.5">
                          <Building2 className="h-3.5 w-3.5 flex-shrink-0" />
                          {concurso.orgao.nome}
                        </span>
                      )}
                      {concurso.estado && (
                        <span className="flex items-center gap-1.5">
                          <MapPin className="h-3.5 w-3.5 flex-shrink-0" />
                          {concurso.estado}
                          {concurso.cidade ? ` - ${concurso.cidade}` : ""}
                        </span>
                      )}
                    </div>
                    {concurso.linkReferencia && (
                      <div className="mt-3 flex items-center gap-1 text-xs font-medium text-brand-blue">
                        <ExternalLink className="h-3.5 w-3.5" />
                        Ver edital
                      </div>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Opportunities detected */}
      {opportunities.length > 0 && (
        <section className="py-12 bg-amber-50 border-t border-amber-100">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100">
                <Bell className="h-5 w-5 text-amber-700" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  Oportunidades Detectadas
                </h2>
                <p className="text-sm text-gray-500">
                  Novos concursos identificados que ainda estão sendo analisados
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {opportunities.map((opp) => (
                <div
                  key={opp.id}
                  className="rounded-xl border border-amber-200 bg-white p-4"
                >
                  <p className="font-medium text-gray-800 text-sm mb-1 line-clamp-2">
                    {opp.nomeProvavel ?? "Oportunidade em analise"}
                  </p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {opp.orgaoProvavel && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-600">
                        <Building2 className="h-3 w-3" />
                        {opp.orgaoProvavel}
                      </span>
                    )}
                    {opp.estadoProvavel && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-600">
                        <MapPin className="h-3 w-3" />
                        {opp.estadoProvavel}
                      </span>
                    )}
                  </div>
                  <p className="mt-2 text-xs text-amber-700 font-medium">
                    Em analise
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
