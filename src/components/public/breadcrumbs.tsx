import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export function Breadcrumbs({ items }: BreadcrumbsProps) {
  const all = [{ label: "Início", href: "/" }, ...items];

  return (
    <nav aria-label="Breadcrumb">
      <ol className="flex flex-wrap items-center gap-1 text-sm text-gray-500">
        {all.map((item, index) => {
          const isLast = index === all.length - 1;
          return (
            <li key={index} className="flex items-center gap-1">
              {index === 0 && <Home className="h-3.5 w-3.5 flex-shrink-0" />}
              {isLast ? (
                <span className="font-medium text-gray-800" aria-current="page">
                  {item.label}
                </span>
              ) : (
                <Link
                  href={item.href ?? "#"}
                  className="hover:text-brand-gold transition-colors"
                >
                  {item.label}
                </Link>
              )}
              {!isLast && (
                <ChevronRight className="h-3.5 w-3.5 flex-shrink-0 text-gray-400" />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
