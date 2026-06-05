"use client";

import Link from "next/link";
import Image from "next/image";
import { Mail, ChevronDown } from "lucide-react";
import { useState } from "react";

const institutionalLinks = [
  { href: "/sobre", label: "Sobre nós" },
  { href: "/como-funciona", label: "Como funciona" },
  { href: "/apostilas", label: "Apostilas" },
  { href: "/categorias", label: "Categorias" },
  { href: "/contato", label: "Contato" },
  { href: "/politica-de-privacidade", label: "Política de Privacidade" },
  { href: "/termos-de-uso", label: "Termos de Uso" },
];

const categoryLinks = [
  { href: "/categorias/concursos-federais", label: "Concursos Federais" },
  { href: "/categorias/concursos-estaduais", label: "Concursos Estaduais" },
  { href: "/categorias/concursos-municipais", label: "Concursos Municipais" },
  { href: "/categorias/area-da-saude", label: "Área de Saúde" },
  { href: "/categorias/area-da-educacao", label: "Área de Educação" },
  { href: "/categorias/seguranca-publica", label: "Segurança Pública" },
  { href: "/categorias/tribunais", label: "Tribunais" },
];

const concursoLinks = [
  { href: "/concursos-novos", label: "Novos Concursos" },
  { href: "/apostilas/estado/SP", label: "Concursos em SP" },
  { href: "/apostilas/estado/RJ", label: "Concursos no RJ" },
  { href: "/apostilas/estado/MG", label: "Concursos em MG" },
  { href: "/busca", label: "Ver todos" },
];

interface AccordionSectionProps {
  title: string;
  links: { href: string; label: string }[];
}

function AccordionSection({ title, links }: AccordionSectionProps) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-t border-white/10">
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between py-3 text-left"
        aria-expanded={open}
      >
        <span className="text-xs font-bold uppercase tracking-widest text-brand-gold">
          {title}
        </span>
        <ChevronDown
          className={`h-4 w-4 text-brand-gold transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open && (
        <ul className="flex flex-col gap-1 pb-3">
          {links.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="block py-1.5 text-sm text-white/60 hover:text-brand-gold-light transition-colors"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-brand-blue text-white">
      {/* Gold top accent line */}
      <div className="h-px w-full bg-gradient-to-r from-transparent via-brand-gold/50 to-transparent" />

      {/* Main footer content */}
      <div className="mx-auto max-w-7xl px-4 py-10 sm:py-14 sm:px-6 lg:px-8">

        {/* Mobile layout: brand + institutional always visible, rest in accordions */}
        <div className="md:hidden">
          {/* Brand */}
          <div className="mb-6">
            <Link href="/" className="mb-4 inline-block">
              <Image
                src="/images/logo-fundo-escuro.png"
                alt="Passei Concurso"
                width={200}
                height={64}
                className="h-8 w-auto"
              />
            </Link>
            <p className="text-sm text-white/55 leading-relaxed mb-4">
              Apostilas organizadas e atualizadas para você conquistar a aprovação nos concursos públicos.
            </p>
            <a
              href="mailto:contato@passeiconcurso.com.br"
              className="inline-flex items-center gap-2 min-h-[44px] text-sm text-white/50 hover:text-brand-gold transition-colors"
            >
              <Mail className="h-4 w-4 flex-shrink-0" />
              contato@passeiconcurso.com.br
            </a>
          </div>

          {/* Accordion columns */}
          <AccordionSection title="Institucional" links={institutionalLinks} />
          <AccordionSection title="Categorias" links={categoryLinks} />
          <AccordionSection title="Concursos" links={concursoLinks} />
        </div>

        {/* Desktop layout: 4-column grid */}
        <div className="hidden md:grid grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand column */}
          <div className="lg:col-span-1">
            <Link href="/" className="mb-5 inline-block">
              <Image
                src="/images/logo-fundo-escuro.png"
                alt="Passei Concurso"
                width={231}
                height={73}
                className="h-10 w-auto"
              />
            </Link>
            <p className="text-sm text-white/55 leading-relaxed mb-5">
              Apostilas organizadas e atualizadas para você se preparar com mais
              eficiência e conquistar a aprovação nos concursos públicos.
            </p>
            <div className="flex flex-col gap-2 text-sm text-white/50">
              <a
                href="mailto:contato@passeiconcurso.com.br"
                className="flex items-center gap-2 hover:text-brand-gold transition-colors"
              >
                <Mail className="h-4 w-4 flex-shrink-0" />
                contato@passeiconcurso.com.br
              </a>
            </div>
          </div>

          {/* Institucional */}
          <div>
            <h3 className="mb-4 text-xs font-bold uppercase tracking-widest text-brand-gold">
              Institucional
            </h3>
            <ul className="flex flex-col gap-2">
              {institutionalLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/60 hover:text-brand-gold-light transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categorias */}
          <div>
            <h3 className="mb-4 text-xs font-bold uppercase tracking-widest text-brand-gold">
              Categorias
            </h3>
            <ul className="flex flex-col gap-2">
              {categoryLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/60 hover:text-brand-gold-light transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Concursos */}
          <div>
            <h3 className="mb-4 text-xs font-bold uppercase tracking-widest text-brand-gold">
              Concursos
            </h3>
            <ul className="flex flex-col gap-2 mb-6">
              {concursoLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/60 hover:text-brand-gold-light transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>

            <div className="rounded-lg border border-brand-gold/20 bg-brand-blue-light p-4">
              <p className="text-xs font-semibold text-brand-gold mb-1">
                Sua aprovação começa aqui
              </p>
              <p className="text-xs text-white/50">
                Materiais organizados e revisados por especialistas.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Certificados e selos de segurança */}
      <div className="bg-white">
        <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6 sm:py-6 lg:px-8">
          <div className="flex flex-col items-center gap-3 sm:gap-4">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400">
              Certificações e Segurança
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-5">
              <Image src="/images/Certificados/SSL.webp" alt="SSL" width={80} height={40} className="h-6 sm:h-8 w-auto" />
              <Image src="/images/Certificados/google-site-seguro.webp" alt="Google Site Seguro" width={80} height={40} className="h-6 sm:h-8 w-auto" />
              <Image src="/images/Certificados/selo-lets.png.webp" alt="Let's Encrypt" width={80} height={40} className="h-6 sm:h-8 w-auto" />
              <Image src="/images/Certificados/ebitFooter.webp" alt="eBit" width={80} height={40} className="h-6 sm:h-8 w-auto" />
              <Image src="/images/Certificados/ra1000.webp" alt="RA 1000" width={80} height={40} className="h-6 sm:h-8 w-auto" />
              <Image src="/images/Certificados/globe.webp" alt="Navegação Segura" width={80} height={40} className="h-6 sm:h-8 w-auto" />
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/8">
        <div className="mx-auto max-w-7xl px-4 py-4 pb-safe sm:px-6 lg:px-8" style={{ paddingBottom: "max(1rem, env(safe-area-inset-bottom))" }}>
          <div className="flex flex-col items-center justify-between gap-2 text-xs text-white/35 sm:flex-row">
            <p>
              &copy; {year} Passei Concurso. Todos os direitos reservados.
            </p>
            <div className="flex gap-4">
              <Link
                href="/politica-de-privacidade"
                className="hover:text-white/60 transition-colors"
              >
                Privacidade
              </Link>
              <Link
                href="/termos-de-uso"
                className="hover:text-white/60 transition-colors"
              >
                Termos
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
