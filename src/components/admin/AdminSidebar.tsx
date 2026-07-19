"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ShoppingBag,
  Sparkles,
  ClipboardList,
  CalendarCheck,
  Users,
  Images,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import clsx from "clsx";
import { useAuth } from "@/context/AuthContext";
import { BRAND } from "@/lib/config";

const LINKS = [
  { href: "/admin/dashboard", label: "Tableau de bord", icon: LayoutDashboard },
  { href: "/admin/products", label: "Produits", icon: ShoppingBag },
  { href: "/admin/services", label: "Services", icon: Sparkles },
  { href: "/admin/orders", label: "Commandes", icon: ClipboardList },
  { href: "/admin/appointments", label: "Rendez-vous", icon: CalendarCheck },
  { href: "/admin/gallery", label: "Galerie", icon: Images },
  { href: "/admin/customers", label: "Clientes", icon: Users },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const { logout } = useAuth();
  const [open, setOpen] = useState(false);

  async function handleLogout() {
    await logout();
    // Hard navigation: guarantees we land on "/" even if the auth guard's
    // own client-side redirect (to /login) fires first as the session clears.
    window.location.href = "/";
  }

  const content = (
    <>
      <div>
        <Link href="/admin/dashboard" className="flex flex-col leading-none">
          <span className="font-display text-xl text-cream">KN Beauty</span>
          <span className="text-[10px] uppercase tracking-[0.3em] text-gold-400">Administration</span>
        </Link>
        <nav className="mt-10 space-y-1">
          {LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className={clsx(
                "flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm transition-colors",
                pathname === link.href ? "bg-gold-500 text-white" : "text-cream/70 hover:bg-white/5 hover:text-cream"
              )}
            >
              <link.icon className="h-4 w-4" /> {link.label}
            </Link>
          ))}
        </nav>
      </div>
      <button
        onClick={handleLogout}
        className="flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm text-cream/70 hover:bg-white/5 hover:text-cream"
      >
        <LogOut className="h-4 w-4" /> Déconnexion
      </button>
    </>
  );

  return (
    <>
      <div className="flex items-center justify-between border-b border-white/10 bg-ink-900 px-4 py-3 lg:hidden">
        <span className="font-display text-lg text-cream">{BRAND.name}</span>
        <button onClick={() => setOpen(true)} aria-label="Menu" className="text-cream">
          <Menu className="h-6 w-6" />
        </button>
      </div>

      <aside className="hidden w-64 shrink-0 flex-col justify-between bg-ink-900 p-6 lg:flex">{content}</aside>

      {open && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div className="relative flex w-72 flex-col justify-between bg-ink-900 p-6">
            <button
              onClick={() => setOpen(false)}
              className="absolute right-4 top-4 text-cream"
              aria-label="Fermer"
            >
              <X className="h-6 w-6" />
            </button>
            {content}
          </div>
          <button className="flex-1 bg-black/40" onClick={() => setOpen(false)} aria-label="Fermer le menu" />
        </div>
      )}
    </>
  );
}
