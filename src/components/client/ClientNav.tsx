"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutGrid, CalendarCheck, Package, UserCircle, LogOut } from "lucide-react";
import clsx from "clsx";
import { useAuth } from "@/context/AuthContext";

const TABS = [
  { href: "/dashboard", label: "Tableau de bord", icon: LayoutGrid },
  { href: "/appointments", label: "Mes rendez-vous", icon: CalendarCheck },
  { href: "/orders", label: "Mes commandes", icon: Package },
  { href: "/profile", label: "Mon profil", icon: UserCircle },
];

export function ClientNav() {
  const pathname = usePathname();
  const { profile, logout } = useAuth();

  async function handleLogout() {
    await logout();
    // Hard navigation: guarantees we land on "/" even if the auth guard's
    // own client-side redirect (to /login) fires first as the session clears.
    window.location.href = "/";
  }

  return (
    <div className="border-b border-nude-200/70 bg-white">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex items-center justify-between py-4">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-ink-500">Mon espace</p>
            <p className="font-display text-lg text-ink-900">{profile?.name}</p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 text-sm text-ink-500 hover:text-blush-500"
          >
            <LogOut className="h-4 w-4" /> Déconnexion
          </button>
        </div>
        <nav className="flex gap-1 overflow-x-auto pb-3">
          {TABS.map((tab) => (
            <Link
              key={tab.href}
              href={tab.href}
              className={clsx(
                "flex items-center gap-2 whitespace-nowrap rounded-full px-4 py-2 text-sm transition-colors",
                pathname === tab.href ? "bg-ink-900 text-cream" : "text-ink-700 hover:bg-nude-100"
              )}
            >
              <tab.icon className="h-4 w-4" /> {tab.label}
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
}
