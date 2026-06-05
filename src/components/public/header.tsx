"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useState, useRef, useEffect, type FormEvent } from "react";
import {
  Search,
  Menu,
  X,
} from "lucide-react";

const navLinks = [
  { href: "/", label: "Início" },
  { href: "/apostilas", label: "Apostilas" },
  { href: "/categorias", label: "Categorias" },
  { href: "/concursos-novos", label: "Concursos Novos" },
  { href: "/sobre", label: "Sobre" },
  { href: "/contato", label: "Contato" },
];

export function Header() {
  const pathname = usePathname();
  const router = useRouter();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (searchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [searchOpen]);

  // Close mobile menu on resize to desktop
  useEffect(() => {
    const handler = () => {
      if (window.innerWidth >= 1024) setMobileOpen(false);
    };
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  function handleSearch(e: FormEvent) {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/busca?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery("");
    }
  }

  function isActive(href: string) {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  }

  return (
    <header className="sticky top-0 z-50 w-full bg-brand-blue shadow-xl">
      {/* Main header bar */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center flex-shrink-0"
            aria-label="Passei Concurso - Página inicial"
          >
            <Image
              src="/images/logo-fundo-escuro.png"
              alt="Passei Concurso"
              width={231}
              height={73}
              className="h-8 w-auto sm:h-10"
              priority
            />
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-0.5" aria-label="Navegação principal">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`relative px-3 py-2 text-sm font-medium transition-colors group ${
                  isActive(link.href)
                    ? "text-brand-gold"
                    : "text-white/75 hover:text-white"
                }`}
              >
                {link.label}
                <span
                  className={`absolute bottom-0 left-3 right-3 h-0.5 rounded-full transition-all duration-200 ${
                    isActive(link.href)
                      ? "bg-brand-gold opacity-100"
                      : "bg-brand-gold opacity-0 group-hover:opacity-60"
                  }`}
                />
              </Link>
            ))}
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-2">
            {/* Search toggle */}
            <div className="relative">
              {searchOpen ? (
                <form
                  onSubmit={handleSearch}
                  className="flex items-center overflow-hidden rounded-lg bg-brand-blue-light ring-2 ring-brand-gold/50"
                >
                  <input
                    ref={searchInputRef}
                    type="search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Buscar apostilas..."
                    className="w-40 sm:w-52 h-11 bg-transparent px-3 py-1.5 text-sm text-white placeholder-white/40 outline-none"
                    aria-label="Busca de apostilas"
                  />
                  <button
                    type="submit"
                    className="h-11 px-3 text-brand-gold hover:text-brand-gold-light transition-colors"
                    aria-label="Buscar"
                  >
                    <Search className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setSearchOpen(false);
                      setSearchQuery("");
                    }}
                    className="h-11 px-2 text-white/50 hover:text-white transition-colors"
                    aria-label="Fechar busca"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </form>
              ) : (
                <button
                  onClick={() => setSearchOpen(true)}
                  className="flex h-11 w-11 items-center justify-center rounded-lg text-white/70 transition-colors hover:bg-white/10 hover:text-brand-gold"
                  aria-label="Abrir busca"
                >
                  <Search className="h-5 w-5" />
                </button>
              )}
            </div>

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="flex h-11 w-11 items-center justify-center rounded-lg text-white/70 transition-colors hover:bg-white/10 hover:text-white lg:hidden"
              aria-label={mobileOpen ? "Fechar menu" : "Abrir menu"}
              aria-expanded={mobileOpen}
            >
              {mobileOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Gold accent line */}
      <div className="h-px w-full bg-gradient-to-r from-transparent via-brand-gold/60 to-transparent" />

      {/* Mobile menu — full-screen overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 top-[65px] z-40 bg-brand-blue-dark overflow-y-auto lg:hidden"
          aria-hidden={!mobileOpen}
        >
          <nav
            className="mx-auto max-w-7xl px-4 py-4 sm:px-6 flex flex-col h-full"
            aria-label="Navegação mobile"
          >
            {/* Mobile search */}
            <form
              onSubmit={(e) => {
                handleSearch(e);
                setMobileOpen(false);
              }}
              className="mb-4 flex items-center overflow-hidden rounded-lg border border-brand-gold/30 bg-brand-blue-light"
            >
              <Search className="ml-3 h-4 w-4 flex-shrink-0 text-white/50" />
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar apostilas..."
                className="flex-1 h-[44px] bg-transparent px-3 text-sm text-white placeholder-white/40 outline-none"
                aria-label="Busca mobile"
              />
              <button
                type="submit"
                className="h-[44px] px-4 text-sm font-semibold text-brand-gold hover:text-brand-gold-light transition-colors"
              >
                Buscar
              </button>
            </form>

            {/* Nav links */}
            <div className="flex flex-col gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center min-h-[44px] rounded-lg px-4 text-sm font-medium transition-colors ${
                    isActive(link.href)
                      ? "bg-brand-gold/15 text-brand-gold border-l-2 border-brand-gold"
                      : "text-white/75 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Spacer pushes CTA to bottom */}
            <div className="flex-1" />

            {/* Prominent gold CTA */}
            <div className="pb-6 pt-4">
              <Link
                href="/busca"
                onClick={() => setMobileOpen(false)}
                className="flex items-center justify-center w-full min-h-[52px] rounded-xl bg-brand-gold px-6 text-base font-bold text-white shadow-lg hover:bg-brand-gold-dark active:scale-95 transition-all"
              >
                Buscar Apostilas
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
