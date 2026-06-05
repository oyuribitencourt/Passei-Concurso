"use client"

import { Menu, Bell, LogOut, User } from "lucide-react"
import { signOut } from "next-auth/react"
import { useState } from "react"
import Link from "next/link"
import { cn } from "@/lib/utils"

interface AdminHeaderProps {
  onMenuClick: () => void
  userName?: string | null
  userEmail?: string | null
  notificacoesCount?: number
}

export function AdminHeader({
  onMenuClick,
  userName,
  userEmail,
  notificacoesCount = 0,
}: AdminHeaderProps) {
  const [userMenuOpen, setUserMenuOpen] = useState(false)

  return (
    <header className="flex h-16 items-center justify-between border-b border-slate-200 bg-white px-4 shadow-sm lg:px-6">
      {/* Left: hamburger */}
      <button
        onClick={onMenuClick}
        className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-700 lg:hidden"
        aria-label="Abrir menu"
      >
        <Menu className="h-5 w-5" />
      </button>

      {/* Center / breadcrumb placeholder */}
      <div className="hidden lg:flex items-center gap-2">
        <span className="text-sm text-slate-500">Painel Administrativo</span>
      </div>

      {/* Right: notifications + user */}
      <div className="flex items-center gap-2">
        <Link
          href="/admin/notificacoes"
          className="relative rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition-colors"
          aria-label="Notificações"
        >
          <Bell className="h-5 w-5" />
          {notificacoesCount > 0 && (
            <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
              {notificacoesCount > 9 ? "9+" : notificacoesCount}
            </span>
          )}
        </Link>

        <div className="relative">
          <button
            onClick={() => setUserMenuOpen((o) => !o)}
            className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white">
              {userName ? userName.charAt(0).toUpperCase() : <User className="h-4 w-4" />}
            </div>
            <span className="hidden sm:block font-medium">{userName ?? "Admin"}</span>
          </button>

          {userMenuOpen && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setUserMenuOpen(false)}
              />
              <div className="absolute right-0 top-full z-20 mt-1 w-56 rounded-xl border border-slate-200 bg-white py-1 shadow-lg">
                <div className="border-b border-slate-100 px-4 py-2.5">
                  <p className="text-sm font-semibold text-slate-800">{userName}</p>
                  <p className="text-xs text-slate-500 truncate">{userEmail}</p>
                </div>
                <button
                  onClick={() => signOut({ callbackUrl: "/admin/login" })}
                  className={cn(
                    "flex w-full items-center gap-2 px-4 py-2.5 text-sm text-red-600",
                    "hover:bg-red-50 transition-colors"
                  )}
                >
                  <LogOut className="h-4 w-4" />
                  Sair
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
