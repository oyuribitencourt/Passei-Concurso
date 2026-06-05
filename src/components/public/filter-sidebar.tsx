"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useCallback, useState, useEffect } from "react";
import { X, SlidersHorizontal } from "lucide-react";

const estados = [
  "AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA",
  "MT", "MS", "MG", "PA", "PB", "PR", "PE", "PI", "RJ", "RN",
  "RS", "RO", "RR", "SC", "SP", "SE", "TO",
];

const niveis = [
  { value: "FUNDAMENTAL", label: "Fundamental" },
  { value: "MEDIO", label: "Médio" },
  { value: "TECNICO", label: "Técnico" },
  { value: "SUPERIOR", label: "Superior" },
];

interface FilterOption {
  value: string;
  label: string;
  count?: number;
}

interface FilterSidebarProps {
  bancas?: FilterOption[];
  categorias?: FilterOption[];
  areas?: FilterOption[];
  totalResults: number;
}

export function FilterSidebar({
  bancas = [],
  categorias = [],
  areas = [],
  totalResults,
}: FilterSidebarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Mobile bottom sheet state
  const [sheetOpen, setSheetOpen] = useState(false);

  // Pending filter state (for mobile "Aplicar" flow)
  const [pendingEstado, setPendingEstado] = useState<string | null>(null);
  const [pendingBanca, setPendingBanca] = useState<string | null>(null);
  const [pendingCategoria, setPendingCategoria] = useState<string | null>(null);
  const [pendingNivel, setPendingNivel] = useState<string | null>(null);
  const [pendingArea, setPendingArea] = useState<string | null>(null);

  const currentEstado = searchParams.get("estado");
  const currentBanca = searchParams.get("banca");
  const currentCategoria = searchParams.get("categoria");
  const currentNivel = searchParams.get("nivel");
  const currentArea = searchParams.get("area");

  const hasFilters =
    currentEstado || currentBanca || currentCategoria || currentNivel || currentArea;

  // Count active filters for badge
  const activeFilterCount = [
    currentEstado,
    currentBanca,
    currentCategoria,
    currentNivel,
    currentArea,
  ].filter(Boolean).length;

  // Sync pending state when sheet opens
  useEffect(() => {
    if (sheetOpen) {
      setPendingEstado(currentEstado);
      setPendingBanca(currentBanca);
      setPendingCategoria(currentCategoria);
      setPendingNivel(currentNivel);
      setPendingArea(currentArea);
    }
  }, [sheetOpen, currentEstado, currentBanca, currentCategoria, currentNivel, currentArea]);

  // Lock body scroll when sheet is open
  useEffect(() => {
    document.body.style.overflow = sheetOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [sheetOpen]);

  // Close sheet on route change
  useEffect(() => {
    setSheetOpen(false);
  }, [pathname, searchParams]);

  const updateFilter = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (params.get(key) === value) {
        params.delete(key);
      } else {
        params.set(key, value);
      }
      params.delete("page");
      router.push(`${pathname}?${params.toString()}`);
    },
    [router, pathname, searchParams]
  );

  const clearAll = useCallback(() => {
    const params = new URLSearchParams(searchParams.toString());
    ["estado", "banca", "categoria", "nivel", "area"].forEach((k) =>
      params.delete(k)
    );
    params.delete("page");
    router.push(`${pathname}?${params.toString()}`);
  }, [router, pathname, searchParams]);

  // Apply pending mobile filters
  function applyPendingFilters() {
    const params = new URLSearchParams(searchParams.toString());
    const filterMap: Record<string, string | null> = {
      estado: pendingEstado,
      banca: pendingBanca,
      categoria: pendingCategoria,
      nivel: pendingNivel,
      area: pendingArea,
    };
    Object.entries(filterMap).forEach(([key, val]) => {
      if (val) {
        params.set(key, val);
      } else {
        params.delete(key);
      }
    });
    params.delete("page");
    router.push(`${pathname}?${params.toString()}`);
    setSheetOpen(false);
  }

  function clearPending() {
    setPendingEstado(null);
    setPendingBanca(null);
    setPendingCategoria(null);
    setPendingNivel(null);
    setPendingArea(null);
  }

  // Shared filter panel content — renders inside sidebar (desktop) or sheet (mobile)
  function FilterContent({
    mobile = false,
    estado,
    banca,
    categoria,
    nivel,
    area,
    onEstado,
    onBanca,
    onCategoria,
    onNivel,
    onArea,
  }: {
    mobile?: boolean;
    estado: string | null;
    banca: string | null;
    categoria: string | null;
    nivel: string | null;
    area: string | null;
    onEstado: (v: string) => void;
    onBanca: (v: string) => void;
    onCategoria: (v: string) => void;
    onNivel: (v: string) => void;
    onArea: (v: string) => void;
  }) {
    return (
      <div className="space-y-6">
        {/* Results count */}
        <p className="text-sm text-gray-500">
          <span className="font-semibold text-gray-900">{totalResults}</span>{" "}
          resultado{totalResults !== 1 ? "s" : ""} encontrado
          {totalResults !== 1 ? "s" : ""}
        </p>

        {/* Estado */}
        <div>
          <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
            Estado
          </h3>
          <div className="grid grid-cols-4 sm:grid-cols-3 gap-1.5">
            {estados.map((uf) => (
              <button
                key={uf}
                onClick={() => onEstado(uf)}
                className={`rounded-lg px-2 min-h-[40px] text-xs font-medium transition-colors ${
                  estado === uf
                    ? "bg-brand-gold text-white"
                    : "bg-gray-50 text-gray-700 hover:bg-gray-100"
                }`}
              >
                {uf}
              </button>
            ))}
          </div>
        </div>

        {/* Nivel */}
        <div>
          <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
            Nível
          </h3>
          <div className="flex flex-col gap-1.5">
            {niveis.map((n) => (
              <button
                key={n.value}
                onClick={() => onNivel(n.value)}
                className={`rounded-lg px-3 min-h-[40px] text-left text-sm font-medium transition-colors ${
                  nivel === n.value
                    ? "bg-brand-gold text-white"
                    : "bg-gray-50 text-gray-700 hover:bg-gray-100"
                }`}
              >
                {n.label}
              </button>
            ))}
          </div>
        </div>

        {/* Categoria */}
        {categorias.length > 0 && (
          <div>
            <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
              Categoria
            </h3>
            <div className="flex flex-col gap-1.5 max-h-48 overflow-y-auto">
              {categorias.map((cat) => (
                <button
                  key={cat.value}
                  onClick={() => onCategoria(cat.value)}
                  className={`flex items-center justify-between rounded-lg px-3 min-h-[40px] text-left text-sm font-medium transition-colors ${
                    categoria === cat.value
                      ? "bg-brand-gold text-white"
                      : "bg-gray-50 text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <span>{cat.label}</span>
                  {cat.count !== undefined && (
                    <span
                      className={`text-xs ${
                        categoria === cat.value ? "text-white/70" : "text-gray-400"
                      }`}
                    >
                      {cat.count}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Banca */}
        {bancas.length > 0 && (
          <div>
            <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
              Banca
            </h3>
            <div className="flex flex-col gap-1.5 max-h-48 overflow-y-auto">
              {bancas.map((b) => (
                <button
                  key={b.value}
                  onClick={() => onBanca(b.value)}
                  className={`flex items-center justify-between rounded-lg px-3 min-h-[40px] text-left text-sm font-medium transition-colors ${
                    banca === b.value
                      ? "bg-brand-gold text-white"
                      : "bg-gray-50 text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <span>{b.label}</span>
                  {b.count !== undefined && (
                    <span
                      className={`text-xs ${
                        banca === b.value ? "text-white/70" : "text-gray-400"
                      }`}
                    >
                      {b.count}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Area */}
        {areas.length > 0 && (
          <div>
            <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
              Área
            </h3>
            <div className="flex flex-col gap-1.5">
              {areas.map((a) => (
                <button
                  key={a.value}
                  onClick={() => onArea(a.value)}
                  className={`rounded-lg px-3 min-h-[40px] text-left text-sm font-medium transition-colors ${
                    area === a.value
                      ? "bg-brand-gold text-white"
                      : "bg-gray-50 text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  {a.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  // Toggle handlers for desktop (immediate URL update)
  function toggleDesktop(key: string, value: string) {
    updateFilter(key, value);
  }

  // Toggle handlers for mobile (update pending state only)
  function togglePending(
    current: string | null,
    setter: (v: string | null) => void,
    value: string
  ) {
    setter(current === value ? null : value);
  }

  return (
    <>
      {/* ── Mobile trigger button (visible only on < lg) ── */}
      <div className="lg:hidden sticky top-[65px] z-30 bg-white border-b border-gray-100 py-2 px-4">
        <div className="flex items-center justify-between">
          <button
            onClick={() => setSheetOpen(true)}
            className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 min-h-[44px] text-sm font-semibold text-gray-700 shadow-sm hover:border-brand-gold/40 transition-colors"
          >
            <SlidersHorizontal className="h-4 w-4 text-brand-gold" />
            Filtros
            {activeFilterCount > 0 && (
              <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-brand-gold text-[10px] font-bold text-white">
                {activeFilterCount}
              </span>
            )}
          </button>
          <span className="text-sm text-gray-500">
            <span className="font-semibold text-gray-900">{totalResults}</span> resultado{totalResults !== 1 ? "s" : ""}
          </span>
        </div>
      </div>

      {/* ── Mobile bottom sheet overlay ── */}
      {sheetOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex flex-col justify-end">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setSheetOpen(false)}
            aria-hidden="true"
          />
          {/* Sheet */}
          <div className="relative z-10 flex flex-col max-h-[90dvh] rounded-t-2xl bg-white shadow-2xl">
            {/* Sheet header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <div className="flex items-center gap-2 font-semibold text-gray-900">
                <SlidersHorizontal className="h-4 w-4 text-brand-gold" />
                Filtros
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => { clearPending(); }}
                  className="text-xs text-red-500 font-medium hover:text-red-700 transition-colors"
                >
                  Limpar tudo
                </button>
                <button
                  onClick={() => setSheetOpen(false)}
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 transition-colors"
                  aria-label="Fechar filtros"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Scrollable filter content */}
            <div className="flex-1 overflow-y-auto px-5 py-4">
              <FilterContent
                mobile
                estado={pendingEstado}
                banca={pendingBanca}
                categoria={pendingCategoria}
                nivel={pendingNivel}
                area={pendingArea}
                onEstado={(v) => togglePending(pendingEstado, setPendingEstado, v)}
                onBanca={(v) => togglePending(pendingBanca, setPendingBanca, v)}
                onCategoria={(v) => togglePending(pendingCategoria, setPendingCategoria, v)}
                onNivel={(v) => togglePending(pendingNivel, setPendingNivel, v)}
                onArea={(v) => togglePending(pendingArea, setPendingArea, v)}
              />
            </div>

            {/* Sheet footer: Aplicar CTA */}
            <div
              className="px-5 pt-3 pb-6 border-t border-gray-100"
              style={{ paddingBottom: "max(1.5rem, env(safe-area-inset-bottom))" }}
            >
              <button
                onClick={applyPendingFilters}
                className="flex w-full items-center justify-center min-h-[52px] rounded-xl bg-brand-gold text-base font-bold text-white shadow-md hover:bg-brand-gold-dark active:scale-95 transition-all"
              >
                Aplicar Filtros
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Desktop sidebar (visible only on lg+) ── */}
      <aside className="hidden lg:block w-full">
        <div className="rounded-xl border border-gray-200 bg-white overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
            <div className="flex items-center gap-2 font-semibold text-gray-900">
              <SlidersHorizontal className="h-4 w-4 text-brand-gold" />
              Filtros
            </div>
            {hasFilters && (
              <button
                onClick={clearAll}
                className="flex items-center gap-1 text-xs text-red-500 hover:text-red-700 transition-colors font-medium"
              >
                <X className="h-3.5 w-3.5" />
                Limpar
              </button>
            )}
          </div>

          <div className="p-5">
            <FilterContent
              estado={currentEstado}
              banca={currentBanca}
              categoria={currentCategoria}
              nivel={currentNivel}
              area={currentArea}
              onEstado={(v) => toggleDesktop("estado", v)}
              onBanca={(v) => toggleDesktop("banca", v)}
              onCategoria={(v) => toggleDesktop("categoria", v)}
              onNivel={(v) => toggleDesktop("nivel", v)}
              onArea={(v) => toggleDesktop("area", v)}
            />
          </div>
        </div>
      </aside>
    </>
  );
}
