import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  baseUrl: string;
  searchParams?: Record<string, string>;
}

function buildUrl(
  baseUrl: string,
  page: number,
  searchParams?: Record<string, string>
): string {
  const params = new URLSearchParams({ ...(searchParams ?? {}), page: String(page) });
  return `${baseUrl}?${params.toString()}`;
}

export function Pagination({
  currentPage,
  totalPages,
  baseUrl,
  searchParams,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  // Desktop range: show pages around current with delta 2
  const delta = 2;
  const desktopRange: (number | "...")[] = [];
  const rangeStart = Math.max(2, currentPage - delta);
  const rangeEnd = Math.min(totalPages - 1, currentPage + delta);

  desktopRange.push(1);
  if (rangeStart > 2) desktopRange.push("...");
  for (let i = rangeStart; i <= rangeEnd; i++) desktopRange.push(i);
  if (rangeEnd < totalPages - 1) desktopRange.push("...");
  if (totalPages > 1) desktopRange.push(totalPages);

  // Mobile range: show only first, current (if not first/last), last
  const mobileRange: (number | "...")[] = [];
  if (totalPages <= 3) {
    for (let i = 1; i <= totalPages; i++) mobileRange.push(i);
  } else {
    mobileRange.push(1);
    if (currentPage > 2) mobileRange.push("...");
    if (currentPage !== 1 && currentPage !== totalPages) mobileRange.push(currentPage);
    if (currentPage < totalPages - 1) mobileRange.push("...");
    mobileRange.push(totalPages);
  }

  const linkClass =
    "inline-flex items-center justify-center rounded-lg text-sm font-medium transition-colors";
  const sizeClass = "h-11 w-11 sm:h-9 sm:w-9"; // 44px on mobile, 36px on desktop
  const activeClass = "bg-brand-gold text-white shadow-sm";
  const inactiveClass = "border border-gray-200 text-gray-700 hover:bg-gray-50";
  const disabledClass = "pointer-events-none opacity-40 border border-gray-200 text-gray-400";

  return (
    <nav
      aria-label="Paginação"
      className="flex items-center justify-center gap-1.5 sm:gap-1"
    >
      {/* Prev button */}
      {currentPage > 1 ? (
        <Link
          href={buildUrl(baseUrl, currentPage - 1, searchParams)}
          className={`${linkClass} ${sizeClass} ${inactiveClass}`}
          aria-label="Página anterior"
        >
          <ChevronLeft className="h-4 w-4" />
        </Link>
      ) : (
        <span className={`${linkClass} ${sizeClass} ${disabledClass}`}>
          <ChevronLeft className="h-4 w-4" />
        </span>
      )}

      {/* Mobile page numbers */}
      <div className="flex items-center gap-1.5 sm:hidden">
        {mobileRange.map((item, i) =>
          item === "..." ? (
            <span key={`m-ellipsis-${i}`} className="px-1 text-gray-400 text-sm">
              …
            </span>
          ) : (
            <Link
              key={`m-${item}`}
              href={buildUrl(baseUrl, item as number, searchParams)}
              className={`${linkClass} ${sizeClass} ${item === currentPage ? activeClass : inactiveClass}`}
              aria-current={item === currentPage ? "page" : undefined}
            >
              {item}
            </Link>
          )
        )}
      </div>

      {/* Desktop page numbers */}
      <div className="hidden sm:flex items-center gap-1">
        {desktopRange.map((item, i) =>
          item === "..." ? (
            <span key={`d-ellipsis-${i}`} className="px-1 text-gray-400">
              ...
            </span>
          ) : (
            <Link
              key={`d-${item}`}
              href={buildUrl(baseUrl, item as number, searchParams)}
              className={`${linkClass} h-9 w-9 ${item === currentPage ? activeClass : inactiveClass}`}
              aria-current={item === currentPage ? "page" : undefined}
            >
              {item}
            </Link>
          )
        )}
      </div>

      {/* Next button */}
      {currentPage < totalPages ? (
        <Link
          href={buildUrl(baseUrl, currentPage + 1, searchParams)}
          className={`${linkClass} ${sizeClass} ${inactiveClass}`}
          aria-label="Próxima página"
        >
          <ChevronRight className="h-4 w-4" />
        </Link>
      ) : (
        <span className={`${linkClass} ${sizeClass} ${disabledClass}`}>
          <ChevronRight className="h-4 w-4" />
        </span>
      )}
    </nav>
  );
}
