"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  BookOpen,
  Trophy,
  Tag,
  Radio,
  Activity,
  Globe,
  Sparkles,
  Bell,
  Settings,
  Plug,
  ChevronDown,
  X,
} from "lucide-react"
import { useState } from "react"

interface NavItem {
  href?: string
  label: string
  icon: React.ElementType
  children?: { href: string; label: string }[]
}

const navItems: NavItem[] = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/apostilas", label: "Apostilas", icon: BookOpen },
  { href: "/admin/concursos", label: "Concursos", icon: Trophy },
  { href: "/admin/categorias", label: "Categorias", icon: Tag },
  {
    label: "Monitoramento",
    icon: Radio,
    children: [
      { href: "/admin/monitoramento/fontes", label: "Fontes" },
      { href: "/admin/monitoramento/novidades", label: "Novidades" },
    ],
  },
  { href: "/admin/notificacoes", label: "Notificações", icon: Bell },
  { href: "/admin/rastreamento", label: "Rastreamento", icon: Activity },
  { href: "/admin/configuracoes", label: "Configurações", icon: Settings },
  {
    label: "Integrações",
    icon: Plug,
    children: [{ href: "/admin/integracoes/ticto", label: "Ticto" }],
  },
]

interface AdminSidebarProps {
  open: boolean
  onClose: () => void
}

export function AdminSidebar({ open, onClose }: AdminSidebarProps) {
  const pathname = usePathname()
  const [expandedGroups, setExpandedGroups] = useState<string[]>([
    "Monitoramento",
    "Integrações",
  ])

  function toggleGroup(label: string) {
    setExpandedGroups((prev) =>
      prev.includes(label) ? prev.filter((g) => g !== label) : [...prev, label]
    )
  }

  function isActive(href: string) {
    return pathname === href || pathname.startsWith(href + "/")
  }

  function groupHasActive(children: { href: string }[]) {
    return children.some((c) => isActive(c.href))
  }

  return (
    <>
      {/* Overlay for mobile */}
      {open && (
        <div
          className="fixed inset-0 z-20 bg-black/50 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-30 flex w-64 flex-col bg-slate-900 transition-transform duration-300 lg:relative lg:translate-x-0 lg:z-auto",
          open ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Header */}
        <div className="flex h-16 items-center justify-between border-b border-slate-700/60 px-5">
          <Link href="/admin/dashboard" className="flex flex-col leading-tight">
            <span className="text-sm font-bold text-white">Passei Concurso</span>
            <span className="text-[10px] font-medium uppercase tracking-widest text-slate-400">
              Admin
            </span>
          </Link>
          <button
            onClick={onClose}
            className="rounded-md p-1 text-slate-400 hover:text-white lg:hidden"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-0.5">
          {navItems.map((item) => {
            if (item.children) {
              const expanded = expandedGroups.includes(item.label)
              const active = groupHasActive(item.children)
              return (
                <div key={item.label}>
                  <button
                    onClick={() => toggleGroup(item.label)}
                    className={cn(
                      "flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                      active
                        ? "bg-slate-700/60 text-white"
                        : "text-slate-400 hover:bg-slate-800 hover:text-slate-200"
                    )}
                  >
                    <span className="flex items-center gap-3">
                      <item.icon className="h-4 w-4 shrink-0" />
                      {item.label}
                    </span>
                    <ChevronDown
                      className={cn(
                        "h-3.5 w-3.5 transition-transform",
                        expanded ? "rotate-180" : ""
                      )}
                    />
                  </button>
                  {expanded && (
                    <div className="ml-7 mt-0.5 space-y-0.5 border-l border-slate-700/60 pl-3">
                      {item.children.map((child) => (
                        <Link
                          key={child.href}
                          href={child.href}
                          onClick={onClose}
                          className={cn(
                            "block rounded-md px-3 py-1.5 text-sm transition-colors",
                            isActive(child.href)
                              ? "bg-blue-600 text-white font-medium"
                              : "text-slate-400 hover:text-slate-200 hover:bg-slate-800"
                          )}
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              )
            }

            return (
              <Link
                key={item.href}
                href={item.href!}
                onClick={onClose}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  isActive(item.href!)
                    ? "bg-blue-600 text-white"
                    : "text-slate-400 hover:bg-slate-800 hover:text-slate-200"
                )}
              >
                <item.icon className="h-4 w-4 shrink-0" />
                {item.label}
              </Link>
            )
          })}
        </nav>

        {/* Footer */}
        <div className="border-t border-slate-700/60 px-5 py-3">
          <p className="text-[10px] text-slate-500">v0.1.0 &mdash; Passei Concurso</p>
        </div>
      </aside>
    </>
  )
}
