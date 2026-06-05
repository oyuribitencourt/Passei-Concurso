import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  CheckCircle2,
  MapPin,
  Building2,
  GraduationCap,
  Calendar,
  Tag,
  ShoppingCart,
  Clock,
  FileText,
  Users,
  Shield,
  BookOpen,
  ArrowRight,
  ChevronRight,
  Star,
  Lock,
} from "lucide-react";
import { prisma } from "@/lib/prisma";
import { ApostilaCard } from "@/components/public/apostila-card";
import { Breadcrumbs } from "@/components/public/breadcrumbs";
import { FaqAccordion } from "@/components/public/faq-accordion";
import { SocialProofBar, Testimonials } from "@/components/public/social-proof";
import type { FaqItem } from "@/components/public/faq-accordion";

export const dynamic = "force-dynamic";

interface ApostilaPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: ApostilaPageProps): Promise<Metadata> {
  const { slug } = await params;
  try {
    const apostila = await prisma.apostila.findUnique({
      where: { slug },
      include: { orgao: true, banca: true },
    });
    if (!apostila) return { title: "Apostila não encontrada" };

    const title =
      apostila.seoTitle ?? `Apostila ${apostila.titulo} - Passei Concurso`;
    const description =
      apostila.seoDescription ?? apostila.descricaoCurta.slice(0, 155);

    return {
      title,
      description,
      keywords: apostila.keywords ?? undefined,
      alternates: {
        canonical: `/apostilas/${slug}`,
      },
      openGraph: {
        title,
        description,
        type: "website",
        ...(apostila.imagemCapa && { images: [apostila.imagemCapa] }),
      },
    };
  } catch {
    return { title: "Apostila" };
  }
}

const nivelLabel: Record<string, string> = {
  FUNDAMENTAL: "Nível Fundamental",
  MEDIO: "Nível Médio",
  TECNICO: "Nível Técnico",
  SUPERIOR: "Nível Superior",
};

const statusLabel: Record<string, { label: string; className: string }> = {
  ABERTO: {
    label: "Inscrições Abertas",
    className: "bg-emerald-100 text-emerald-800",
  },
  EM_ANDAMENTO: {
    label: "Em Andamento",
    className: "bg-blue-100 text-blue-800",
  },
  ENCERRADO: {
    label: "Encerrado",
    className: "bg-gray-100 text-gray-700",
  },
  PREVISTO: {
    label: "Previsto",
    className: "bg-amber-100 text-amber-800",
  },
  ANULADO: {
    label: "Anulado",
    className: "bg-red-100 text-red-800",
  },
};

const defaultFaq: FaqItem[] = [
  {
    question: "Como acesso a apostila após a compra?",
    answer:
      "Após a confirmação do pagamento, você recebe um e-mail com o link de acesso ao material. O acesso é imediato.",
  },
  {
    question: "A apostila cobre todo o conteúdo do edital?",
    answer:
      "Sim. O material é elaborado com base no edital oficial, cobrindo todos os tópicos exigidos no programa.",
  },
  {
    question: "Posso acessar pelo celular?",
    answer:
      "Sim. O material em formato PDF pode ser acessado em qualquer dispositivo: computador, tablet ou smartphone.",
  },
  {
    question: "É possível solicitar reembolso?",
    answer:
      "Sim. De acordo com o Código de Defesa do Consumidor, você tem 7 dias corridos para solicitar o cancelamento com reembolso integral.",
  },
];

const purchaseSteps = [
  {
    step: "01",
    title: "Clique em Comprar Agora",
    description: "Você será redirecionado para a página de checkout segura.",
  },
  {
    step: "02",
    title: "Escolha a forma de pagamento",
    description: "Pix, cartão de crédito ou boleto bancário.",
  },
  {
    step: "03",
    title: "Confirme o pagamento",
    description: "Após a confirmação, o acesso é liberado imediatamente.",
  },
  {
    step: "04",
    title: "Estude com tranquilidade",
    description: "Acesse o material quando e onde quiser.",
  },
];

function parseConteudo(text: string): string[] {
  return text
    .split("\n")
    .map((line) => line.replace(/^[-*•]\s*/, "").trim())
    .filter((line) => line.length > 0);
}

function parseBeneficios(text: string): string[] {
  return text
    .split("\n")
    .map((line) => line.replace(/^[-*•]\s*/, "").trim())
    .filter((line) => line.length > 0);
}

export default async function ApostilaDetailPage({
  params,
}: ApostilaPageProps) {
  const { slug } = await params;

  const apostila = await prisma.apostila.findUnique({
    where: { slug },
    include: { categoria: true, banca: true, orgao: true, concurso: true },
  });

  if (!apostila || apostila.status !== "PUBLICADO") notFound();

  // Related apostilas
  const relatedOrConditions = [
    apostila.categoriaId ? { categoriaId: apostila.categoriaId } : null,
    apostila.bancaId ? { bancaId: apostila.bancaId } : null,
    apostila.estado ? { estado: apostila.estado } : null,
  ].filter(Boolean) as {
    categoriaId?: string;
    bancaId?: string;
    estado?: string;
  }[];

  const related = await prisma.apostila.findMany({
    where: {
      status: "PUBLICADO",
      id: { not: apostila.id },
      ...(relatedOrConditions.length > 0 && { OR: relatedOrConditions }),
    },
    include: { categoria: true, banca: true, orgao: true },
    take: 4,
    orderBy: { createdAt: "desc" },
  });

  const preco = apostila.precoExibido
    ? Number(apostila.precoExibido).toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
      })
    : null;

  const precoOriginal = apostila.precoOriginal
    ? Number(apostila.precoOriginal).toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
      })
    : null;

  const desconto =
    apostila.precoOriginal && apostila.precoExibido && Number(apostila.precoOriginal) > Number(apostila.precoExibido)
      ? Math.round(((Number(apostila.precoOriginal) - Number(apostila.precoExibido)) / Number(apostila.precoOriginal)) * 100)
      : null;

  const economiaValor =
    apostila.precoOriginal && apostila.precoExibido && Number(apostila.precoOriginal) > Number(apostila.precoExibido)
      ? (Number(apostila.precoOriginal) - Number(apostila.precoExibido)).toLocaleString("pt-BR", {
          style: "currency",
          currency: "BRL",
        })
      : null;

  const parcelamento = apostila.precoExibido
    ? (Math.ceil((Number(apostila.precoExibido) / 12) * 100) / 100).toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
      })
    : null;

  const statusInfo =
    statusLabel[apostila.statusConcurso] ?? statusLabel["ABERTO"];

  const conteudoItems = apostila.conteudoProgramatico
    ? parseConteudo(apostila.conteudoProgramatico)
    : [];

  const beneficiosItems = apostila.beneficios
    ? parseBeneficios(apostila.beneficios)
    : [];

  const publicoItems = apostila.publicoAlvo
    ? parseBeneficios(apostila.publicoAlvo)
    : [];

  let faqItems: FaqItem[] = defaultFaq;
  if (apostila.faq) {
    try {
      const parsed = JSON.parse(apostila.faq);
      if (Array.isArray(parsed) && parsed.length > 0) {
        faqItems = parsed.map((item: { question?: string; answer?: string; pergunta?: string; resposta?: string }) => ({
          question: item.question || item.pergunta || "",
          answer: item.answer || item.resposta || "",
        }));
      }
    } catch {
      // Use default FAQ
    }
  }

  // JSON-LD structured data
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: apostila.titulo,
    description: apostila.descricaoCurta,
    ...(apostila.imagemCapa && { image: apostila.imagemCapa }),
    brand: { "@type": "Brand", name: "Passei Concurso" },
    ...(preco && {
      offers: {
        "@type": "Offer",
        priceCurrency: "BRL",
        price: Number(apostila.precoExibido).toFixed(2),
        availability: apostila.linkCheckoutTicto
          ? "https://schema.org/InStock"
          : "https://schema.org/PreOrder",
        url: `https://passeiconcurso.com.br/apostilas/${apostila.slug}`,
      },
    }),
  };

  return (
    <>
      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className={`min-h-screen bg-gray-50 ${apostila.linkCheckoutTicto ? "pb-20 lg:pb-0" : ""}`}>
        {/* ================================================================
            COMPACT HERO — Breadcrumbs + Title + Mockup + CTA
        ================================================================ */}
        <section
          className="relative bg-[#0A1D3B] overflow-hidden"
          style={
            apostila.imagemHeroBg
              ? {
                  backgroundImage: `url(${apostila.imagemHeroBg})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }
              : undefined
          }
        >
          {apostila.imagemHeroBg && (
            <div className="absolute inset-0 bg-[#0A1D3B]/85" />
          )}
          {!apostila.imagemHeroBg && (
            <div className="absolute inset-0 opacity-[0.04]">
              <div className="absolute inset-0" style={{ backgroundImage: "repeating-linear-gradient(45deg, #D4A017 0, #D4A017 1px, transparent 0, transparent 50%)", backgroundSize: "24px 24px" }} />
            </div>
          )}
          <div className="absolute top-0 left-0 right-0 h-1 bg-[#D4A017]" />

          <div className="relative z-10 mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
            <Breadcrumbs
              items={[
                { label: "Apostilas", href: "/apostilas" },
                ...(apostila.categoria
                  ? [{ label: apostila.categoria.nome, href: `/categorias/${apostila.categoria.slug}` }]
                  : []),
                { label: apostila.titulo },
              ]}
            />

            <div className="mt-4 grid grid-cols-1 items-center gap-4 sm:mt-5 sm:gap-6 lg:grid-cols-12 lg:gap-10">
              {/* MOCKUP — side by side, principal na frente ao centro */}
              <div className="order-2 flex justify-center lg:col-span-4 lg:order-2 lg:justify-center">
                {(apostila.imagemMockup || apostila.imagemCapa) ? (
                  <div className="relative flex items-end justify-center">
                    {/* Glow effect behind mockup */}
                    <div className="absolute inset-0 -inset-x-8 -inset-y-4">
                      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[70%] rounded-full bg-[#D4A017]/20 blur-[60px]" />
                      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[50%] h-[50%] rounded-full bg-white/10 blur-[40px]" />
                    </div>
                    {/* Mockup 2 — esquerda, atrás */}
                    {apostila.imagemMockup2 && (
                      <div className="w-[100px] sm:w-[130px] lg:w-[155px] -mr-6 sm:-mr-8 lg:-mr-10 mb-4 opacity-80 animate-[float_6s_ease-in-out_infinite_0.3s]">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={apostila.imagemMockup2} alt="" className="w-full h-auto drop-shadow-[0_10px_30px_rgba(212,160,23,0.3)]" />
                      </div>
                    )}
                    {/* Mockup 1 — principal, frente, maior */}
                    <div className="relative z-10 w-[190px] sm:w-[240px] lg:w-[280px] animate-[float_6s_ease-in-out_infinite]">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={apostila.imagemMockup || apostila.imagemCapa || ""}
                        alt={`Mockup: ${apostila.titulo}`}
                        className="w-full h-auto drop-shadow-[0_15px_40px_rgba(212,160,23,0.35)]"
                      />
                    </div>
                    {/* Mockup 3 — direita, atrás */}
                    {apostila.imagemMockup3 && (
                      <div className="w-[100px] sm:w-[130px] lg:w-[155px] -ml-6 sm:-ml-8 lg:-ml-10 mb-4 opacity-80 animate-[float_6s_ease-in-out_infinite_0.5s]">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={apostila.imagemMockup3} alt="" className="w-full h-auto drop-shadow-[0_10px_30px_rgba(212,160,23,0.3)]" />
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="relative flex w-[160px] flex-col items-center justify-center rounded-xl border border-[#D4A017]/20 px-5 py-8 text-center sm:w-[200px] sm:py-10 lg:w-[240px] lg:py-12 animate-[float_6s_ease-in-out_infinite] shadow-[0_0_60px_rgba(212,160,23,0.25)]"
                    style={{
                      aspectRatio: "3/4",
                      background: "linear-gradient(160deg, #132D54 0%, #0A1D3B 50%, #061325 100%)",
                    }}
                  >
                    <div className="absolute top-0 left-0 right-0 h-1 rounded-t-xl bg-[#D4A017]" />
                    <div className="absolute bottom-0 left-0 right-0 h-1 rounded-b-xl bg-[#D4A017]" />
                    <div className="flex h-12 w-12 items-center justify-center rounded-full border border-[#D4A017]/40 bg-[#D4A017]/10 mb-4">
                      <BookOpen className="h-6 w-6 text-[#D4A017]" />
                    </div>
                    <p className="text-sm font-bold leading-snug text-white line-clamp-4 sm:text-base">
                      {apostila.titulo}
                    </p>
                    <div className="mt-4 flex gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-3 w-3 fill-[#D4A017] text-[#D4A017]" />
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* TEXT + CTA — left column, order-1 on mobile so CTA appears before mockup */}
              <div className="order-1 lg:col-span-8 lg:order-1">
                <div className="flex flex-wrap gap-2 mb-3">
                  {apostila.categoria && (
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-[#D4A017]/40 bg-[#D4A017]/10 px-3 py-1 text-xs font-semibold text-[#D4A017]">
                      <Tag className="h-3 w-3" />
                      {apostila.categoria.nome}
                    </span>
                  )}
                  <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${statusInfo.className}`}>
                    {statusInfo.label}
                  </span>
                </div>

                <h1 className="text-xl font-bold leading-tight text-white sm:text-2xl lg:text-4xl mb-2">
                  {apostila.titulo}
                </h1>

                {/* Social proof — stars + sales count */}
                <div className="flex items-center gap-2 mb-3">
                  <div className="flex gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-3.5 w-3.5 fill-[#D4A017] text-[#D4A017]" />
                    ))}
                  </div>
                  <span className="text-xs font-semibold text-[#D4A017]">4.9</span>
                  <span className="text-xs text-white/50">|</span>
                  <span className="text-xs text-white/60">+2.500 vendas</span>
                </div>

                <p className="mb-4 max-w-2xl text-sm leading-relaxed text-white/70 sm:text-base line-clamp-2 sm:line-clamp-3">
                  {apostila.descricaoCurta}
                </p>

                {/* Info chips — compact horizontal row */}
                <div className="flex flex-wrap gap-1.5 mb-4 sm:mb-5">
                  {apostila.orgao && (
                    <span className="inline-flex items-center gap-1 rounded-md bg-white/10 px-2 py-1 text-xs text-white/75">
                      <Building2 className="h-3 w-3 text-[#D4A017]" />
                      {apostila.orgao.sigla || apostila.orgao.nome}
                    </span>
                  )}
                  {apostila.banca && (
                    <span className="inline-flex items-center gap-1 rounded-md bg-white/10 px-2 py-1 text-xs text-white/75">
                      <FileText className="h-3 w-3 text-[#D4A017]" />
                      {apostila.banca.nome}
                    </span>
                  )}
                  {apostila.estado && (
                    <span className="inline-flex items-center gap-1 rounded-md bg-white/10 px-2 py-1 text-xs text-white/75">
                      <MapPin className="h-3 w-3 text-[#D4A017]" />
                      {apostila.estado}{apostila.cidade ? ` - ${apostila.cidade}` : ""}
                    </span>
                  )}
                  {apostila.nivel && (
                    <span className="inline-flex items-center gap-1 rounded-md bg-white/10 px-2 py-1 text-xs text-white/75">
                      <GraduationCap className="h-3 w-3 text-[#D4A017]" />
                      {nivelLabel[apostila.nivel]}
                    </span>
                  )}
                  {apostila.ano && (
                    <span className="inline-flex items-center gap-1 rounded-md bg-white/10 px-2 py-1 text-xs text-white/75">
                      <Calendar className="h-3 w-3 text-[#D4A017]" />
                      {apostila.ano}
                    </span>
                  )}
                </div>

                {/* Micro-urgency when discount is active */}
                {desconto && (
                  <div className="mb-3 inline-flex items-center gap-1.5 rounded-md bg-red-500/15 border border-red-500/30 px-3 py-1.5 text-xs font-semibold text-red-300">
                    <Clock className="h-3 w-3" />
                    Últimas unidades com desconto de {desconto}%
                  </div>
                )}

                {/* Inline CTA — visible on all screens */}
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                  {preco && (
                    <div className="flex items-center gap-3">
                      {desconto && precoOriginal && (
                        <>
                          <span className="rounded-lg bg-red-500 px-2.5 py-1 text-sm font-extrabold text-white animate-pulse">
                            -{desconto}%
                          </span>
                          <span className="text-base text-white/50 line-through sm:text-lg">
                            {precoOriginal}
                          </span>
                        </>
                      )}
                      <span className="text-2xl font-extrabold text-[#D4A017] sm:text-3xl">{preco}</span>
                    </div>
                  )}
                  {apostila.linkCheckoutTicto ? (
                    <a
                      href={apostila.linkCheckoutTicto}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#22c55e] px-8 py-3.5 text-base font-bold text-white shadow-lg shadow-green-500/25 transition-all hover:bg-[#16a34a] active:scale-95 sm:w-auto sm:py-3"
                    >
                      <ShoppingCart className="h-5 w-5" />
                      Comprar Agora
                    </a>
                  ) : (
                    <div className="flex items-center justify-center gap-2 rounded-xl bg-white/20 px-8 py-3 text-sm font-semibold text-white/60 cursor-not-allowed">
                      <Clock className="h-4 w-4" />
                      Em Breve
                    </div>
                  )}
                </div>
                {/* Trust badges — visible on ALL screens including mobile */}
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-3 text-xs text-white/50">
                  <span className="flex items-center gap-1"><CheckCircle2 className="h-3 w-3 text-[#D4A017]" /> Acesso imediato</span>
                  <span className="flex items-center gap-1"><Shield className="h-3 w-3 text-[#D4A017]" /> 7 dias de garantia</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <SocialProofBar />

        {/* ================================================================
            CONTENT + SIDEBAR
        ================================================================ */}
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
          <div className="grid grid-cols-1 gap-6 sm:gap-8 lg:grid-cols-3">
            {/* ---- MAIN CONTENT ---- */}
            <div className="space-y-6 sm:space-y-8 lg:col-span-2">
              {/* O que você vai receber */}
              {beneficiosItems.length > 0 && (
                <section className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm sm:p-8">
                  <div className="mb-5 flex items-center gap-3">
                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-[#D4A017]/10">
                      <Star className="h-5 w-5 text-[#D4A017]" />
                    </div>
                    <h2 className="text-lg font-bold text-gray-900 sm:text-2xl">
                      O que você vai receber
                    </h2>
                  </div>
                  <ul className="grid grid-cols-1 gap-3">
                    {beneficiosItems.map((item, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-[#D4A017]" />
                        <span className="text-gray-700">{item}</span>
                      </li>
                    ))}
                  </ul>
                </section>
              )}

              {/* Para quem é esta apostila */}
              {publicoItems.length > 0 && (
                <section className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm sm:p-8">
                  <div className="mb-5 flex items-center gap-3">
                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-[#0A1D3B]/8">
                      <Users className="h-5 w-5 text-[#0A1D3B]" />
                    </div>
                    <h2 className="text-lg font-bold text-gray-900 sm:text-2xl">
                      Para quem é esta apostila
                    </h2>
                  </div>
                  <ul className="flex flex-col gap-3">
                    {publicoItems.map((item, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <ChevronRight className="mt-0.5 h-5 w-5 flex-shrink-0 text-[#0A1D3B]" />
                        <span className="text-gray-700">{item}</span>
                      </li>
                    ))}
                  </ul>
                </section>
              )}

              {/* Sobre este material */}
              {apostila.descricaoLonga && (
                <section className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm sm:p-8">
                  <h2 className="mb-4 text-lg font-bold text-gray-900 sm:text-2xl">
                    Sobre este material
                  </h2>
                  <div className="prose prose-gray max-w-none whitespace-pre-wrap leading-relaxed text-gray-600">
                    {apostila.descricaoLonga}
                  </div>
                </section>
              )}

              {/* Conteúdo Programático */}
              {conteudoItems.length > 0 && (
                <section className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm sm:p-8">
                  <div className="mb-5 flex items-center gap-3">
                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-[#D4A017]/10">
                      <BookOpen className="h-5 w-5 text-[#D4A017]" />
                    </div>
                    <h2 className="text-lg font-bold text-gray-900 sm:text-2xl">
                      Conteúdo Programático
                    </h2>
                  </div>
                  <ul className="grid grid-cols-1 gap-2">
                    {conteudoItems.map((item, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-2 border-b border-gray-50 py-1.5"
                      >
                        <span className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-[#D4A017]" />
                        <span className="text-sm text-gray-700">{item}</span>
                      </li>
                    ))}
                  </ul>
                </section>
              )}

              {/* Por que estudar com esta apostila */}
              <section className="rounded-2xl bg-gradient-to-br from-[#0A1D3B] to-[#132D54] p-4 sm:p-8">
                <h2 className="mb-2 text-lg font-bold text-white sm:text-2xl">
                  Por que estudar com esta apostila
                </h2>
                <div className="mb-6 h-0.5 w-12 bg-[#D4A017]" />
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  {[
                    {
                      icon: FileText,
                      title: "Conteúdo Organizado",
                      desc: "Tópicos estruturados de forma lógica para facilitar o aprendizado progressivo.",
                    },
                    {
                      icon: CheckCircle2,
                      title: "Alinhado ao Edital",
                      desc: "Cada tópico cobre exatamente o que é exigido no edital oficial do concurso.",
                    },
                    {
                      icon: Clock,
                      title: "Otimize seu Tempo",
                      desc: "Estude com foco, sem perder tempo procurando o conteúdo certo.",
                    },
                    {
                      icon: Shield,
                      title: "Material Confiável",
                      desc: "Revisado por profissionais com experiência em concursos públicos.",
                    },
                  ].map((reason) => {
                    const Icon = reason.icon;
                    return (
                      <div key={reason.title} className="flex gap-3">
                        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg border border-[#D4A017]/30 bg-[#D4A017]/15">
                          <Icon className="h-5 w-5 text-[#D4A017]" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-white">
                            {reason.title}
                          </p>
                          <p className="mt-0.5 text-xs leading-relaxed text-white/65">
                            {reason.desc}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>

              {/* Como funciona a compra */}
              <section className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm sm:p-8">
                <h2 className="mb-5 text-lg font-bold text-gray-900 sm:text-2xl">
                  Como funciona a compra
                </h2>
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  {purchaseSteps.map((step) => (
                    <div key={step.step} className="flex gap-4">
                      <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-[#D4A017] text-sm font-bold text-white shadow-md shadow-amber-400/30">
                        {step.step}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-900">
                          {step.title}
                        </p>
                        <p className="mt-0.5 text-xs leading-relaxed text-gray-500">
                          {step.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* Dúvidas Frequentes */}
              <section className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm sm:p-8">
                <div className="mb-5 flex items-center gap-3">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-[#0A1D3B]">
                    <Shield className="h-5 w-5 text-[#D4A017]" />
                  </div>
                  <h2 className="text-lg font-bold text-gray-900 sm:text-2xl">
                    Dúvidas Frequentes
                  </h2>
                </div>
                <FaqAccordion items={faqItems} />
              </section>

              {/* Garantia de 7 dias */}
              <section className="rounded-2xl border-2 border-[#22c55e]/30 bg-[#22c55e]/5 p-4 sm:p-6">
                <div className="flex items-start gap-3 sm:gap-4">
                  <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full bg-[#22c55e]/15">
                    <Shield className="h-6 w-6 text-[#22c55e]" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-gray-900 sm:text-lg">
                      Garantia incondicional de 7 dias
                    </h3>
                    <p className="mt-1 text-sm leading-relaxed text-gray-600">
                      Se você não ficar satisfeito, devolvemos 100% do seu dinheiro. Sem burocracia.
                    </p>
                  </div>
                </div>
              </section>
            </div>

            {/* ---- STICKY SIDEBAR — desktop only ---- */}
            <div className="hidden lg:block lg:col-span-1">
              <div className="sticky top-24 space-y-4">
                <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-xl">
                  {/* Card header */}
                  <div className="bg-[#0A1D3B] px-6 py-4">
                    <p className="text-xs font-semibold uppercase tracking-wider text-[#D4A017]">
                      Material de Estudo Premium
                    </p>
                    <h3 className="mt-1 text-sm font-bold leading-snug text-white">
                      {apostila.titulo}
                    </h3>
                  </div>

                  <div className="p-6">
                    {preco ? (
                      <div className="mb-5">
                        {desconto && precoOriginal && (
                          <>
                            <div className="mb-3 flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2">
                              <Clock className="h-4 w-4 flex-shrink-0 text-red-600" />
                              <span className="text-xs font-semibold text-red-700">
                                Oferta por tempo limitado
                              </span>
                            </div>
                            <div className="mb-2 flex items-center gap-2">
                              <span className="animate-pulse rounded-md bg-red-500 px-2 py-0.5 text-xs font-extrabold text-white">
                                -{desconto}% OFF
                              </span>
                              <span className="text-sm text-gray-400 line-through">
                                {precoOriginal}
                              </span>
                            </div>
                          </>
                        )}
                        <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                          {desconto ? "Por apenas" : "Preço"}
                        </p>
                        <p className="mt-0.5 text-3xl font-bold text-[#22c55e]">
                          {preco}
                        </p>
                        {parcelamento && (
                          <p className="mt-0.5 text-xs text-gray-500">
                            ou{" "}
                            <span className="font-semibold">
                              12x de {parcelamento}
                            </span>
                          </p>
                        )}
                        {economiaValor && (
                          <p className="mt-1 text-xs font-semibold text-[#22c55e]">
                            Economia de {economiaValor}
                          </p>
                        )}
                        <p className="mt-1 text-xs font-medium text-emerald-600">
                          Acesso imediato após a compra
                        </p>
                      </div>
                    ) : (
                      <div className="mb-5">
                        <p className="text-lg font-semibold text-gray-500">
                          Breve disponível
                        </p>
                      </div>
                    )}

                    {apostila.linkCheckoutTicto ? (
                      <a
                        href={apostila.linkCheckoutTicto}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mb-1 flex w-full items-center justify-center gap-2 rounded-xl bg-[#22c55e] py-4 text-base font-bold text-white shadow-lg shadow-green-500/25 transition-all hover:bg-[#16a34a] hover:shadow-green-500/35 active:scale-95"
                      >
                        <ShoppingCart className="h-5 w-5" />
                        Comprar Agora
                        <ArrowRight className="h-5 w-5" />
                      </a>
                    ) : (
                      <div className="mb-1 flex w-full cursor-not-allowed items-center justify-center gap-2 rounded-xl bg-gray-200 py-3.5 text-sm font-semibold text-gray-500">
                        Em Breve
                      </div>
                    )}
                    <p className="mb-4 text-center text-[10px] text-gray-400">
                      Você será redirecionado para o checkout seguro
                    </p>

                    <div className="flex flex-wrap gap-x-4 gap-y-2 border-t border-gray-100 pt-4 text-xs text-gray-500">
                      <div className="flex items-center gap-1.5">
                        <Lock className="h-3.5 w-3.5 flex-shrink-0 text-[#D4A017]" />
                        Compra 100% segura
                      </div>
                      <div className="flex items-center gap-1.5">
                        <CheckCircle2 className="h-3.5 w-3.5 flex-shrink-0 text-[#D4A017]" />
                        Acesso imediato
                      </div>
                      <div className="flex items-center gap-1.5">
                        <CheckCircle2 className="h-3.5 w-3.5 flex-shrink-0 text-[#D4A017]" />
                        7 dias de garantia
                      </div>
                    </div>

                    <div className="mt-3 border-t border-gray-100 pt-3">
                      <p className="text-[10px] font-medium uppercase tracking-wide text-gray-400 mb-2">
                        Formas de pagamento
                      </p>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src="/images/formasdepagamentocompix.webp"
                        alt="Formas de pagamento: Cartão de Crédito e Pix"
                        className="w-full max-w-[200px]"
                        loading="lazy"
                      />
                    </div>
                  </div>
                </div>

                {/* Sidebar — avaliação e confiança */}
                <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
                  <div className="flex items-center justify-center gap-1">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Star
                        key={i}
                        className="h-4 w-4 fill-amber-400 text-amber-400"
                      />
                    ))}
                    <span className="ml-1.5 text-sm font-bold text-[#0A1D3B]">
                      4.9
                    </span>
                    <span className="text-xs text-gray-500">
                      (2.847 avaliações)
                    </span>
                  </div>
                </div>

                {/* Sidebar trust block */}
                <div className="rounded-2xl border border-[#D4A017]/20 bg-[#D4A017]/5 p-5">
                  <div className="flex flex-col gap-2.5 text-xs text-gray-600">
                    <div className="flex items-start gap-2">
                      <Lock className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-[#D4A017]" />
                      Compra 100% segura
                    </div>
                    <div className="flex items-start gap-2">
                      <Shield className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-[#D4A017]" />
                      Elaborado por especialistas em concursos
                    </div>
                    <div className="flex items-start gap-2">
                      <BookOpen className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-[#D4A017]" />
                      Atualizado conforme o edital vigente
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-[#D4A017]" />
                      Garantia de 7 dias ou seu dinheiro de volta
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <Testimonials />

        {/* ================================================================
            CTA BANNER — before related products
        ================================================================ */}
        {apostila.linkCheckoutTicto && (
          <div className="bg-[#0A1D3B]">
            <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-12 lg:px-8">
              <div className="flex flex-col items-center gap-5 text-center sm:flex-row sm:justify-between sm:gap-6 sm:text-left">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-widest text-[#D4A017]">
                    Não perca tempo
                  </p>
                  <h2 className="mt-1 text-2xl font-bold text-white sm:text-3xl">
                    Garanta seu material de estudo agora
                  </h2>
                  <p className="mt-2 max-w-md text-sm text-white/65">
                    Acesso imediato, pagamento seguro e garantia de 7 dias. Comece
                    a estudar hoje mesmo.
                  </p>
                </div>
                <div className="flex w-full flex-shrink-0 flex-col items-center gap-3 sm:w-auto sm:items-end">
                  {preco && (
                    <div className="flex items-center justify-center gap-3 sm:justify-end">
                      {desconto && precoOriginal && (
                        <>
                          <span className="rounded-lg bg-red-500 px-2.5 py-1 text-sm font-extrabold text-white">-{desconto}%</span>
                          <span className="text-lg text-white/40 line-through">{precoOriginal}</span>
                        </>
                      )}
                      <span className="text-3xl font-bold text-[#22c55e]">{preco}</span>
                    </div>
                  )}
                  <a
                    href={apostila.linkCheckoutTicto}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#22c55e] px-8 py-4 text-base font-bold text-white shadow-lg shadow-green-500/25 transition-all hover:bg-[#16a34a] hover:shadow-green-500/40 active:scale-95 sm:w-auto sm:inline-flex"
                  >
                    <ShoppingCart className="h-5 w-5" />
                    Comprar Agora
                    <ArrowRight className="h-4 w-4" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================================================================
            RELATED PRODUCTS
        ================================================================ */}
        {related.length > 0 && (
          <section className="bg-gray-100 py-10 sm:py-14">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="mb-6 sm:mb-8 flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-[#D4A017]">
                    Continue estudando
                  </p>
                  <h2 className="mt-1 text-2xl font-bold text-gray-900">
                    Apostilas Relacionadas
                  </h2>
                </div>
                <Link
                  href="/busca"
                  className="flex items-center gap-1.5 text-sm font-semibold text-[#0A1D3B] hover:underline"
                >
                  Ver mais
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
              <div className="flex overflow-x-auto gap-4 pb-4 -mx-4 px-4 snap-x sm:grid sm:grid-cols-2 sm:overflow-x-visible sm:mx-0 sm:px-0 sm:pb-0 lg:grid-cols-4">
                {related.map((a) => (
                  <div key={a.id} className="snap-start min-w-[280px] flex-shrink-0 sm:min-w-0 sm:flex-shrink">
                    <ApostilaCard apostila={a} />
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ================================================================
            MOBILE STICKY CTA
        ================================================================ */}
        {apostila.linkCheckoutTicto && (
          <div className="fixed bottom-0 left-0 right-0 z-40 bg-white px-4 pt-2.5 pb-[calc(0.625rem+env(safe-area-inset-bottom))] shadow-[0_-4px_20px_rgba(0,0,0,0.15)] lg:hidden">
            <style dangerouslySetInnerHTML={{ __html: `
              @keyframes ctaPulse {
                0%, 100% { box-shadow: 0 10px 15px -3px rgba(34,197,94,0.3); }
                50% { box-shadow: 0 10px 15px -3px rgba(34,197,94,0.3), 0 0 0 6px rgba(34,197,94,0.15); }
              }
              .cta-pulse-once { animation: ctaPulse 0.8s ease-out 0.3s 2; }
            `}} />
            <div className="mx-auto flex max-w-md items-center gap-3">
              {preco && (
                <div className="flex-shrink-0">
                  {desconto && precoOriginal && (
                    <div className="flex items-center gap-1 mb-0.5">
                      <span className="rounded bg-red-500 px-1 py-0.5 text-[9px] font-extrabold text-white">-{desconto}%</span>
                      <span className="text-[11px] text-gray-400 line-through">{precoOriginal}</span>
                    </div>
                  )}
                  <p className="text-xl font-extrabold leading-none text-[#22c55e]">{preco}</p>
                </div>
              )}
              <a
                href={apostila.linkCheckoutTicto}
                target="_blank"
                rel="noopener noreferrer"
                className="cta-pulse-once flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#22c55e] min-h-[52px] text-base font-bold text-white shadow-lg shadow-green-500/30 transition-colors hover:bg-[#16a34a] active:scale-[0.97]"
              >
                <ShoppingCart className="h-5 w-5" />
                Comprar Agora
              </a>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
