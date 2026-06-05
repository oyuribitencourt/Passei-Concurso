import type { Metadata } from "next";
import { BookOpen, Target, Shield, Users, CheckCircle2 } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Sobre - Passei Concurso",
  description:
    "Conheça a Passei Concurso. Nossa missão é facilitar a preparação para concursos públicos com apostilas organizadas, atualizadas e acessíveis.",
};

const values = [
  {
    icon: Target,
    title: "Foco na Aprovação",
    description:
      "Tudo que desenvolvemos tem um único objetivo: ajudar você a passar no concurso que escolheu.",
  },
  {
    icon: Shield,
    title: "Conteúdo Confiável",
    description:
      "Cada material disponível passa por revisão criteriosa antes de chegar até você.",
  },
  {
    icon: Users,
    title: "Acessibilidade",
    description:
      "Materiais com preço justo para que a preparação de qualidade seja acessível a todos.",
  },
  {
    icon: BookOpen,
    title: "Organização",
    description:
      "Conteúdo estruturado de forma lógica para que você estude com eficiência e sem perder tempo.",
  },
];

const howWeWork = [
  "Monitoramos editais e concursos publicados em todo o Brasil",
  "Organizamos o conteúdo programático de cada concurso",
  "Revisamos e atualizamos os materiais conforme novas informações",
  "Disponibilizamos as apostilas de forma rápida e segura",
  "Acompanhamos o lançamento de novos editais continuamente",
];

export default function SobrePage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="bg-brand-blue py-12 sm:py-20">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15 sm:mb-6 sm:h-16 sm:w-16">
            <BookOpen className="h-6 w-6 text-white sm:h-8 sm:w-8" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-3 sm:text-5xl sm:mb-4">
            Sobre a Passei Concurso
          </h1>
          <p className="text-base text-white/70 leading-relaxed max-w-2xl mx-auto sm:text-xl">
            Nascemos da necessidade de tornar a preparação para concursos
            públicos mais acessível, organizada e eficiente.
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className="py-10 bg-white sm:py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-12 items-center">
            <div>
              <span className="mb-2 block text-sm font-semibold uppercase tracking-wider text-brand-gold">
                Nossa missão
              </span>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Sua aprovação começa aqui
              </h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                A Passei Concurso é uma plataforma especializada em apostilas
                para concursos públicos brasileiros. Nosso objetivo é oferecer
                materiais de estudo organizados, atualizados e alinhados ao
                edital de cada concurso, para que você possa se preparar com
                mais foco e eficiência.
              </p>
              <p className="text-gray-600 leading-relaxed">
                Acreditamos que a preparação de qualidade não precisa ser cara
                nem complicada. Por isso, trabalhamos para reunir e organizar as
                apostilas dos principais concursos do país em um único lugar de
                fácil acesso.
              </p>
            </div>
            <div className="rounded-2xl bg-gray-50 p-5 border border-gray-100 sm:p-8">
              <h3 className="font-bold text-gray-900 mb-4 text-lg">
                Como trabalhamos
              </h3>
              <ul className="flex flex-col gap-3">
                {howWeWork.map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-brand-gold" />
                    <span className="text-gray-600 text-sm">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-10 bg-gray-50 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold text-gray-900">Nossos valores</h2>
            <p className="mt-2 text-gray-500">
              Os princípios que guiam cada decisão que tomamos
            </p>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((value) => {
              const Icon = value.icon;
              return (
                <div
                  key={value.title}
                  className="rounded-xl bg-white p-4 text-center border border-gray-100 shadow-sm sm:p-6"
                >
                  <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-brand-blue/10">
                    <Icon className="h-6 w-6 text-brand-blue" />
                  </div>
                  <h3 className="mb-2 font-bold text-gray-900">
                    {value.title}
                  </h3>
                  <p className="text-sm text-gray-500 leading-relaxed">
                    {value.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-10 bg-brand-blue sm:py-16">
        <div className="mx-auto max-w-2xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white mb-4">
            Pronto para começar?
          </h2>
          <p className="text-white/70 mb-8">
            Encontre a apostila ideal para o seu próximo concurso.
          </p>
          <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Link
              href="/busca"
              className="inline-flex items-center gap-2 rounded-xl bg-brand-gold px-8 py-4 text-base font-bold text-white shadow-lg shadow-amber-900/20 transition-all hover:bg-brand-gold-dark"
            >
              Buscar Apostilas
            </Link>
            <Link
              href="/contato"
              className="inline-flex items-center gap-2 rounded-xl border-2 border-white/30 px-8 py-4 text-base font-semibold text-white transition-all hover:bg-white/10"
            >
              Fale Conosco
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
