import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  Star,
  ShoppingCart,
  Search,
  FileText,
  Zap,
  BookOpen,
  Users,
  TrendingUp,
  Award,
  Shield,
  RefreshCw,
  Lock,
  ChevronRight,
  MapPin,
  Flag,
  Globe,
  Heart,
  GraduationCap,
  Scale,
  Building,
} from "lucide-react";
import { prisma } from "@/lib/prisma";
import { ApostilaCard } from "@/components/public/apostila-card";
import { CategoryCard } from "@/components/public/category-card";
import { HeroSearch } from "@/components/public/hero-search";
import { TrustBadges } from "@/components/public/trust-badges";
import { FaqAccordion } from "@/components/public/faq-accordion";
import type { FaqItem } from "@/components/public/faq-accordion";

export const dynamic = "force-dynamic";

async function getFeaturedApostilas() {
  try {
    return await prisma.apostila.findMany({
      where: { status: "PUBLICADO" },
      include: { categoria: true, banca: true, orgao: true },
      orderBy: { createdAt: "desc" },
      take: 8,
    });
  } catch {
    return [];
  }
}

async function getCategories() {
  try {
    return await prisma.categoria.findMany({
      where: { ativo: true },
      orderBy: { ordem: "asc" },
      take: 8,
      include: {
        _count: { select: { apostilas: { where: { status: "PUBLICADO" } } } },
      },
    });
  } catch {
    return [];
  }
}

const stats = [
  { icon: BookOpen, value: "100+", label: "Apostilas disponíveis" },
  { icon: Users, value: "5.000+", label: "Alunos atendidos" },
  { icon: TrendingUp, value: "98%", label: "Satisfação dos clientes" },
  { icon: RefreshCw, value: "2025", label: "Materiais atualizados" },
];

const staticCategories = [
  { nome: "Federal", slug: "federal", Icon: Globe },
  { nome: "Estadual", slug: "estadual", Icon: Flag },
  { nome: "Municipal", slug: "municipal", Icon: MapPin },
  { nome: "Saúde", slug: "saude", Icon: Heart },
  { nome: "Educação", slug: "educacao", Icon: GraduationCap },
  { nome: "Segurança", slug: "seguranca", Icon: Shield },
  { nome: "Tribunais", slug: "tribunais", Icon: Scale },
  { nome: "Prefeituras", slug: "prefeituras", Icon: Building },
];

const howItWorks = [
  {
    step: "01",
    icon: Search,
    title: "Escolha seu concurso",
    description:
      "Use nossa busca para encontrar apostilas por órgão, cargo, estado ou banca organizadora.",
  },
  {
    step: "02",
    icon: ShoppingCart,
    title: "Finalize a compra",
    description:
      "Pagamento seguro e rápido. Aceitamos cartão, Pix e boleto bancário.",
  },
  {
    step: "03",
    icon: BookOpen,
    title: "Acesse sua apostila",
    description:
      "Acesso imediato após a confirmação do pagamento. Estude no seu ritmo.",
  },
];

const benefits = [
  {
    icon: TrendingUp,
    title: "Conteúdo Atualizado",
    description:
      "Materiais revisados e atualizados para refletir o edital mais recente de cada concurso.",
  },
  {
    icon: FileText,
    title: "Material Organizado",
    description:
      "Conteúdo programático estruturado por tópicos, facilitando o planejamento de estudos.",
  },
  {
    icon: Zap,
    title: "Acesso Rápido",
    description:
      "Disponível imediatamente após a compra. Sem espera, sem filas.",
  },
  {
    icon: Award,
    title: "Compra Segura",
    description:
      "Plataforma de pagamento confiável com criptografia e proteção ao consumidor.",
  },
];

const trustStatements = [
  {
    icon: CheckCircle2,
    title: "Revisados por especialistas",
    description:
      "Cada apostila passa por revisão de profissionais com experiência em concursos públicos antes de ser publicada.",
  },
  {
    icon: Star,
    title: "Conteúdo alinhado ao edital",
    description:
      "Os materiais são elaborados com base no edital oficial de cada concurso, cobrindo todos os tópicos exigidos.",
  },
  {
    icon: Users,
    title: "Foco na aprovação",
    description:
      "Nossa missão é oferecer o material mais completo e organizado para que você chegue bem preparado na prova.",
  },
];

const faqItems: FaqItem[] = [
  {
    question: "Como funciona o acesso após a compra?",
    answer:
      "Assim que seu pagamento for confirmado, você recebe um e-mail com as instruções de acesso. O material fica disponível imediatamente na sua área de acesso.",
  },
  {
    question: "As apostilas são em formato PDF?",
    answer:
      "Sim, todos os materiais são disponibilizados em formato PDF, que pode ser lido em qualquer dispositivo: computador, tablet ou smartphone.",
  },
  {
    question: "O conteúdo é atualizado conforme o edital?",
    answer:
      "Sim. Nossas apostilas são elaboradas ou revisadas com base no edital vigente de cada concurso. Quando um edital é atualizado, o material é revisado.",
  },
  {
    question: "Qual a forma de pagamento aceita?",
    answer:
      "Aceitamos pagamento via Pix, cartão de crédito (parcelado ou à vista) e boleto bancário. O processamento é feito pela plataforma Ticto, com total segurança.",
  },
  {
    question: "Posso imprimir o material?",
    answer:
      "Isso depende das configurações do arquivo de cada produto. Consulte a página do produto para saber mais detalhes sobre as permissões de impressão.",
  },
  {
    question: "É possível pedir reembolso?",
    answer:
      "Sim. De acordo com o Código de Defesa do Consumidor, você tem 7 dias corridos após a compra para solicitar o cancelamento e o reembolso integral, desde que o material não tenha sido amplamente utilizado.",
  },
];

export default async function HomePage() {
  const [apostilas, categorias] = await Promise.all([
    getFeaturedApostilas(),
    getCategories(),
  ]);

  return (
    <>
      {/* ===== HERO ===== */}
      <section
        id="hero-bg"
        className="hero-section relative overflow-hidden bg-brand-blue bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/images/hero-bg2.png')" }}
        aria-label="Cabeçalho principal"
      >
        {/* Dark overlay — ensures readability over the background image */}
        <div className="absolute inset-0 bg-brand-blue/85 pointer-events-none" />

        {/* Decorative blobs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 h-96 w-96 rounded-full bg-brand-gold/5" />
          <div className="absolute top-20 -left-20 h-64 w-64 rounded-full bg-white/3" />
          <div className="absolute bottom-0 right-1/4 h-48 w-48 rounded-full bg-brand-gold/5" />
          {/* Dot grid pattern */}
          <div
            className="absolute inset-0 opacity-5"
            style={{
              backgroundImage:
                "radial-gradient(circle at 1px 1px, rgba(212,160,23,0.5) 1px, transparent 0)",
              backgroundSize: "40px 40px",
            }}
          />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-20 lg:px-8 lg:py-32">
          <div className="mx-auto max-w-3xl text-center">
            {/* Eyebrow badge */}
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-brand-gold/15 border border-brand-gold/30 px-4 py-1.5 text-sm text-brand-gold">
              <span className="h-2 w-2 rounded-full bg-brand-gold animate-pulse" />
              Apostilas atualizadas para 2025/2026
            </div>

            {/* Headline */}
            <h1 className="mb-5 text-3xl font-bold leading-tight text-white sm:text-5xl lg:text-6xl">
              Sua Aprovação Começa{" "}
              <span className="text-brand-gold">Com o Material Certo</span>
            </h1>

            {/* Subheadline */}
            <p className="mb-8 text-base leading-relaxed text-white/65 sm:text-xl sm:mb-10">
              Apostilas organizadas, atualizadas e prontas para acelerar sua
              preparação. De federais a municipais, temos o conteúdo que você
              precisa para passar.
            </p>

            {/* Gold search bar */}
            <div className="mx-auto max-w-2xl mb-10">
              <HeroSearch size="large" />
            </div>

            {/* Trust badges */}
            <TrustBadges variant="dark" />
          </div>
        </div>

        {/* Bottom fade */}
        <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-white/5 to-transparent pointer-events-none" />
      </section>

      {/* ===== STATS / TRUST BAR ===== */}
      <section
        className="bg-white border-b border-gray-100 py-8"
        aria-label="Números da plataforma"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {stats.map((stat) => {
              const Icon = stat.icon;
              return (
                <div
                  key={stat.label}
                  className="flex flex-col items-center gap-1.5 text-center sm:flex-row sm:items-center sm:gap-3 sm:text-left"
                >
                  <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-brand-gold/10 sm:h-11 sm:w-11">
                    <Icon className="h-4 w-4 text-brand-gold sm:h-5 sm:w-5" />
                  </div>
                  <div>
                    <p className="text-lg font-extrabold text-brand-blue leading-none sm:text-xl">
                      {stat.value}
                    </p>
                    <p className="text-[11px] text-gray-500 mt-0.5 sm:text-xs">{stat.label}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ===== FEATURED APOSTILAS ===== */}
      <section className="py-16 bg-gray-50" aria-label="Apostilas em destaque">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-10 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <span className="mb-2 block text-xs font-semibold uppercase tracking-widest text-brand-gold">
                Seleção especial
              </span>
              <h2 className="text-3xl font-bold text-gray-900">
                Apostilas em Destaque
              </h2>
              <p className="mt-2 text-gray-500">
                Os materiais mais completos para os concursos em aberto
              </p>
            </div>
            <Link
              href="/apostilas"
              className="flex items-center gap-2 rounded-lg border border-brand-blue px-5 py-2.5 text-sm font-semibold text-brand-blue transition-colors hover:bg-brand-blue hover:text-white"
            >
              Ver todas as apostilas
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {apostilas.length > 0 ? (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {apostilas.map((apostila) => (
                <ApostilaCard key={apostila.id} apostila={apostila} />
              ))}
            </div>
          ) : (
            <div className="rounded-xl border border-dashed border-gray-300 bg-white py-16 text-center">
              <BookOpen className="mx-auto mb-3 h-10 w-10 text-gray-300" />
              <p className="font-medium text-gray-500">
                Em breve novos materiais por aqui.
              </p>
              <p className="text-sm text-gray-400">
                Cadastre-se para ser avisado.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* ===== CATEGORIES ===== */}
      <section className="py-16 bg-white" aria-label="Categorias de concursos">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-10 text-center">
            <span className="mb-2 block text-xs font-semibold uppercase tracking-widest text-brand-gold">
              Navegue por área
            </span>
            <h2 className="text-3xl font-bold text-gray-900">
              Explore por Categoria
            </h2>
            <p className="mt-2 text-gray-500 max-w-xl mx-auto">
              Encontre apostilas organizadas pela sua área de interesse
            </p>
          </div>

          {categorias.length > 0 ? (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
              {categorias.map((cat) => (
                <CategoryCard
                  key={cat.id}
                  nome={cat.nome}
                  slug={cat.slug}
                  descricao={cat.descricao}
                  totalApostilas={cat._count.apostilas}
                />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
              {staticCategories.map(({ nome, slug, Icon }) => (
                <Link
                  key={slug}
                  href={`/categorias/${slug}`}
                  className="group flex flex-col items-center rounded-xl border border-gray-200 bg-white p-4 text-center shadow-sm transition-all duration-200 hover:shadow-md hover:-translate-y-1 hover:border-brand-gold/30 sm:p-6"
                >
                  <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-xl bg-brand-blue/5 group-hover:bg-brand-gold/10 transition-colors sm:mb-3 sm:h-12 sm:w-12">
                    <Icon className="h-5 w-5 text-brand-blue group-hover:text-brand-gold transition-colors sm:h-6 sm:w-6" />
                  </div>
                  <h3 className="font-semibold text-gray-900 group-hover:text-brand-blue transition-colors text-xs sm:text-sm">
                    {nome}
                  </h3>
                </Link>
              ))}
            </div>
          )}

          <div className="mt-10 text-center">
            <Link
              href="/categorias"
              className="inline-flex items-center gap-2 rounded-lg bg-brand-blue px-7 py-3.5 text-sm font-bold text-white transition-colors hover:bg-brand-blue-dark shadow-md"
            >
              Explorar todas as categorias
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ===== HOW IT WORKS ===== */}
      <section
        className="py-16 bg-gray-50"
        aria-label="Como funciona a plataforma"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <span className="mb-2 block text-xs font-semibold uppercase tracking-widest text-brand-gold">
              Simples e rápido
            </span>
            <h2 className="text-3xl font-bold text-gray-900">Como Funciona</h2>
            <p className="mt-2 text-gray-500">Em 3 passos você já está estudando</p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {howItWorks.map((step, i) => {
              const Icon = step.icon;
              return (
                <div key={step.step} className="relative text-center">
                  {/* Connecting dashed gold line */}
                  {i < howItWorks.length - 1 && (
                    <div className="absolute top-10 left-1/2 hidden w-full translate-x-6 border-t-2 border-dashed border-brand-gold/30 md:block" />
                  )}
                  <div className="relative">
                    {/* Navy icon box with gold numbered badge */}
                    <div className="relative mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-blue shadow-lg sm:h-20 sm:w-20">
                      <Icon className="h-7 w-7 text-white sm:h-9 sm:w-9" />
                      <span className="absolute -top-3 -right-3 flex h-8 w-8 items-center justify-center rounded-full bg-brand-gold text-xs font-extrabold text-white shadow-md border-2 border-white">
                        {step.step}
                      </span>
                    </div>
                    <h3 className="mb-2 text-lg font-bold text-gray-900">
                      {step.title}
                    </h3>
                    <p className="text-gray-500 leading-relaxed max-w-xs mx-auto">
                      {step.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ===== BENEFITS ===== */}
      <section className="py-16 bg-white" aria-label="Benefícios da plataforma">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <span className="mb-2 block text-xs font-semibold uppercase tracking-widest text-brand-gold">
              Por que nos escolher
            </span>
            <h2 className="text-3xl font-bold text-gray-900">
              Por que escolher a Passei Concurso
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {benefits.map((benefit) => {
              const Icon = benefit.icon;
              return (
                <div
                  key={benefit.title}
                  className="group rounded-xl border border-gray-100 bg-gray-50 p-4 text-center transition-all hover:shadow-lg hover:-translate-y-1 hover:border-brand-gold/20 overflow-hidden relative sm:p-6"
                >
                  {/* Gold top accent bar on hover */}
                  <div className="absolute top-0 left-0 right-0 h-0.5 bg-brand-gold scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
                  {/* Navy icon with gold icon color */}
                  <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-blue group-hover:bg-brand-blue-light transition-colors">
                    <Icon className="h-7 w-7 text-brand-gold" />
                  </div>
                  <h3 className="mb-2 font-bold text-gray-900">{benefit.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">
                    {benefit.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ===== CTA BANNER ===== */}
      <section
        className="py-16 bg-brand-blue"
        aria-label="Encontre sua apostila"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-2xl bg-white/5 border border-white/10 px-5 py-8 text-center sm:px-8 sm:py-12">
            {/* Gold glow accents */}
            <div className="absolute -top-12 -right-12 h-40 w-40 rounded-full bg-brand-gold/10 blur-3xl pointer-events-none" />
            <div className="absolute -bottom-12 -left-12 h-40 w-40 rounded-full bg-brand-gold/10 blur-3xl pointer-events-none" />

            <div className="relative">
              <span className="mb-3 block text-xs font-semibold uppercase tracking-widest text-brand-gold">
                Comece agora
              </span>
              <h2 className="mb-3 text-xl font-bold text-white sm:text-3xl lg:text-4xl">
                Encontre a apostila para o seu concurso
              </h2>
              <p className="mb-8 text-white/60 max-w-lg mx-auto">
                Sua aprovação está a uma busca de distância. Explore nosso acervo
                e escolha o material ideal para a sua preparação.
              </p>
              <div className="mx-auto max-w-xl mb-6">
                <HeroSearch placeholder="Busque por concurso, órgão ou banca..." />
              </div>
              <p className="text-xs text-white/40">
                Sem cadastro necessário para ver as apostilas disponíveis.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ===== TRUST SECTION ===== */}
      <section className="py-16 bg-white" aria-label="Por que confiar em nos">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <span className="mb-2 block text-xs font-semibold uppercase tracking-widest text-brand-gold">
              Nossa promessa
            </span>
            <h2 className="text-3xl font-bold text-gray-900">
              Material que você pode confiar
            </h2>
            <p className="mt-3 text-gray-500 max-w-2xl mx-auto">
              Cada apostila disponível na plataforma passa por um processo
              criterioso antes de chegar até você.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {trustStatements.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.title}
                  className="flex flex-col items-center text-center rounded-xl border border-gray-100 bg-gray-50 p-8 hover:shadow-md hover:-translate-y-0.5 transition-all"
                >
                  <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-brand-gold/10">
                    <Icon className="h-7 w-7 text-brand-gold" />
                  </div>
                  <h3 className="mb-2 text-lg font-bold text-gray-900">
                    {item.title}
                  </h3>
                  <p className="text-gray-500 leading-relaxed text-sm">
                    {item.description}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Guarantee badges */}
          <div className="mt-12 rounded-xl border border-gray-100 bg-gray-50 px-5 py-6 sm:px-8">
            <div className="grid grid-cols-2 gap-4 sm:flex sm:flex-wrap sm:items-center sm:justify-center sm:gap-8">
              {(
                [
                  { Icon: Lock, label: "Pagamento criptografado" },
                  { Icon: Shield, label: "Compra 100% segura" },
                  { Icon: Zap, label: "Acesso imediato" },
                  { Icon: RefreshCw, label: "7 dias de garantia" },
                ] as const
              ).map(({ Icon, label }) => (
                <div key={label} className="flex items-center gap-2.5 text-gray-600">
                  <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-brand-blue/8">
                    <Icon className="h-4 w-4 text-brand-blue" />
                  </div>
                  <span className="text-sm font-medium">{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ===== FAQ ===== */}
      <section className="py-10 bg-gray-50 sm:py-16" aria-label="Perguntas frequentes">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <div className="mb-10 text-center">
            <span className="mb-2 block text-xs font-semibold uppercase tracking-widest text-brand-gold">
              Tire suas dúvidas
            </span>
            <h2 className="text-3xl font-bold text-gray-900">
              Dúvidas Frequentes
            </h2>
            <p className="mt-2 text-gray-500">
              Respondemos as perguntas mais comuns dos nossos alunos
            </p>
          </div>
          <FaqAccordion items={faqItems} />
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-500">
              Ainda tem dúvidas?{" "}
              <Link
                href="/contato"
                className="font-semibold text-brand-gold hover:text-brand-gold-dark transition-colors"
              >
                Entre em contato
              </Link>
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
