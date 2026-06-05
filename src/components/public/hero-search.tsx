"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";

interface HeroSearchProps {
  placeholder?: string;
  mobilePlaceholder?: string;
  defaultValue?: string;
  className?: string;
  size?: "default" | "large";
}

export function HeroSearch({
  placeholder = "Busque por concurso, cargo, órgão ou banca...",
  mobilePlaceholder = "Buscar apostilas...",
  defaultValue = "",
  className = "",
  size = "default",
}: HeroSearchProps) {
  const [query, setQuery] = useState(defaultValue);
  const router = useRouter();

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/busca?q=${encodeURIComponent(query.trim())}`);
    }
  }

  const isLarge = size === "large";

  return (
    <form
      onSubmit={handleSubmit}
      className={`flex w-full flex-col sm:flex-row items-stretch overflow-hidden rounded-xl border-2 border-white/20 bg-white shadow-2xl transition-all focus-within:border-brand-gold/60 ${className}`}
      role="search"
    >
      <div className="flex flex-1 items-center gap-3 pl-5">
        <Search
          className={`flex-shrink-0 text-gray-400 ${isLarge ? "h-5 w-5" : "h-4 w-4"}`}
        />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          className={`hidden sm:block w-full bg-transparent py-4 text-gray-900 placeholder-gray-400 outline-none ${
            isLarge ? "text-base md:text-lg" : "text-base md:text-base"
          }`}
          aria-label="Busca de apostilas"
        />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={mobilePlaceholder}
          className={`sm:hidden w-full bg-transparent py-4 text-base text-gray-900 placeholder-gray-400 outline-none`}
          aria-label="Busca de apostilas"
        />
      </div>
      <button
        type="submit"
        className={`w-full sm:w-auto min-h-[48px] bg-brand-gold px-6 py-3 sm:py-0 font-semibold text-base text-white transition-colors hover:bg-brand-gold-dark focus-visible:outline-2 focus-visible:outline-brand-gold ${
          isLarge ? "sm:text-base sm:px-8" : "sm:text-sm sm:px-7"
        }`}
      >
        Buscar Apostilas
      </button>
    </form>
  );
}
