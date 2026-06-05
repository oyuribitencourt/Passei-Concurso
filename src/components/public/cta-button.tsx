"use client";

import Link from "next/link";
import { type ReactNode } from "react";

interface CtaButtonProps {
  href?: string;
  onClick?: () => void;
  children: ReactNode;
  variant?: "primary" | "secondary" | "outline";
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
  fullWidth?: boolean;
  external?: boolean;
}

const sizeClasses = {
  sm: "px-4 py-2 text-sm",
  md: "px-6 py-2.5 text-base",
  lg: "px-8 py-3.5 text-lg",
  xl: "px-10 py-4 text-xl",
};

const variantClasses = {
  primary:
    "bg-brand-gold text-white font-semibold shadow-lg shadow-amber-900/20 hover:bg-brand-gold-dark active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2",
  secondary:
    "bg-brand-blue text-white font-semibold shadow-lg shadow-blue-900/30 hover:bg-brand-blue-dark active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-brand-blue focus-visible:ring-offset-2",
  outline:
    "border-2 border-brand-gold text-brand-gold font-semibold bg-transparent hover:bg-brand-gold hover:text-white active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2",
};

export function CtaButton({
  href,
  onClick,
  children,
  variant = "primary",
  size = "md",
  className = "",
  disabled = false,
  type = "button",
  fullWidth = false,
  external = false,
}: CtaButtonProps) {
  const baseClasses = [
    "inline-flex items-center justify-center gap-2 rounded-lg",
    "transition-all duration-200",
    "cursor-pointer select-none",
    sizeClasses[size],
    variantClasses[variant],
    fullWidth ? "w-full" : "",
    disabled ? "opacity-50 pointer-events-none" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  if (href) {
    if (external) {
      return (
        <a
          href={href}
          className={baseClasses}
          target="_blank"
          rel="noopener noreferrer"
        >
          {children}
        </a>
      );
    }
    return (
      <Link href={href} className={baseClasses}>
        {children}
      </Link>
    );
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={baseClasses}
    >
      {children}
    </button>
  );
}
