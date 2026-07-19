"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, ShoppingBag, User } from "lucide-react";
import clsx from "clsx";
import { BRAND } from "@/lib/config";
import { useAuth } from "@/context/AuthContext";
import { useCartStore } from "@/lib/cart-store";

const LINKS = [
  { href: "/", label: "Accueil" },
  { href: "/services", label: "Services" },
  { href: "/boutique", label: "Boutique" },
  { href: "/gallery", label: "Galerie" },
  { href: "/contact", label: "Contact" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const { profile } = useAuth();
  const cartCount = useCartStore((s) => s.items.reduce((n, i) => n + i.quantity, 0));

  return (
    <header className="sticky top-0 z-40 border-b border-nude-200/70 bg-cream/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex flex-col leading-none" onClick={() => setOpen(false)}>
          <span className="font-display text-xl tracking-wide text-ink-900">KN Beauty</span>
          <span className="text-[10px] uppercase tracking-[0.3em] text-gold-600">Studio</span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={clsx(
                "text-sm tracking-wide text-ink-700 transition-colors hover:text-ink-900",
                pathname === link.href && "text-ink-900 font-medium underline decoration-gold-500 underline-offset-8"
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Link href="/boutique/panier" className="relative flex h-10 w-10 items-center justify-center rounded-full hover:bg-nude-100" aria-label="Panier">
            <ShoppingBag className="h-5 w-5 text-ink-900" strokeWidth={1.5} />
            {cartCount > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-blush-500 text-[10px] text-white">
                {cartCount}
              </span>
            )}
          </Link>

          <Link
            href={profile ? (profile.role === "admin" ? "/admin/dashboard" : "/dashboard") : "/login"}
            className="hidden h-10 items-center gap-2 rounded-full border border-ink-900/15 px-4 text-sm text-ink-900 hover:border-ink-900/40 md:flex"
          >
            <User className="h-4 w-4" strokeWidth={1.5} />
            {profile ? profile.name.split(" ")[0] : "Se connecter"}
          </Link>

          <button
            className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-nude-100 md:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-label="Menu"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open && (
        <nav className="border-t border-nude-200/70 bg-cream px-4 py-4 md:hidden">
          <ul className="flex flex-col gap-1">
            {LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className={clsx(
                    "block rounded-lg px-3 py-2.5 text-sm text-ink-700",
                    pathname === link.href && "bg-nude-100 font-medium text-ink-900"
                  )}
                >
                  {link.label}
                </Link>
              </li>
            ))}
            <li className="mt-2 border-t border-nude-200/70 pt-2">
              <Link
                href={profile ? (profile.role === "admin" ? "/admin/dashboard" : "/dashboard") : "/login"}
                onClick={() => setOpen(false)}
                className="block rounded-lg px-3 py-2.5 text-sm font-medium text-ink-900"
              >
                {profile ? `Mon espace (${profile.name.split(" ")[0]})` : "Se connecter / S'inscrire"}
              </Link>
            </li>
          </ul>
        </nav>
      )}
      <span className="sr-only">{BRAND.name}</span>
    </header>
  );
}
