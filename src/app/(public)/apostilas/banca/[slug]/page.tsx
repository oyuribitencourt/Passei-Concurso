import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { FileText, ArrowRight } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { ApostilaCard } from "@/components/public/apostila-card";
import { Breadcrumbs } from "@/components/public/breadcrumbs";
import { EmptyState } from "@/components/public/empty-state";

export const dynamic = 'force-dynamic';

interface BancaPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: BancaPageProps): Promise<Metadata> {
  const { slug } = await params;
  try {
    const banca = await prisma.banca.findUnique({ where: { slug } });
    if (!banca) return { title: "Banca não encontrada" };
    return {
      title: `Apostilas para Concursos da ${banca.nome}`,
      description: `Encontre apostilas organizadas para todos os concursos realizados pela banca ${banca.nome}. Conteúdo atualizado e alinhado ao edital.`,
    };
  } catch {
    return { title: "Banca" };
  }
}

export default async function BancaPage({ params }: BancaPageProps) {
  const { slug } = await params;

  const banca = await prisma.banca.findUnique({ where: { slug } });

  if (!banca) notFound();

  const apostilas = await prisma.apostila.findMany({
    where: { status: "PUBLICADO", bancaId: banca.id },
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
              { label: `Banca: ${banca.nome}` },
            ]}
          />
          <div className="mt-6 max-w-2xl">
            <div className="mb-4 flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/15">
                <FileText className="h-5 w-5 text-white" />
              </div>
              <span className="text-sm font-medium text-white/60 uppercase tracking-wider">
                Banca Organizadora
              </span>
            </div>
            <h1 className="text-4xl font-bold text-white mb-3">
              Apostilas para concursos da {banca.nome}
            </h1>
            <p className="text-white/70 text-lg leading-relaxed">
              Encontre materiais completos para todos os concursos organizados
              pela {banca.nome}. Conteúdo alinhado ao padrão e perfil da banca.
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
              title={`Nenhuma apostila para a ${banca.nome} ainda`}
              description="Em breve novos materiais para esta banca. Use a busca para encontrar outras opções."
              action={{ label: "Buscar apostilas", href: "/busca" }}
            />
          )}
        </div>
      </section>
    </div>
  );
}
