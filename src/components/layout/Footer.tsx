import Link from "next/link";
import { AtSign, MapPin, MessageCircle } from "lucide-react";
import { BRAND, whatsappLink } from "@/lib/config";

export function Footer() {
  return (
    <footer className="mt-24 border-t border-nude-200/70 bg-nude-50">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-3">
        <div>
          <span className="font-display text-2xl text-ink-900">{BRAND.name}</span>
          <p className="mt-3 max-w-xs text-sm leading-relaxed text-ink-500">{BRAND.description}</p>
        </div>

        <div>
          <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-ink-500">Navigation</h3>
          <ul className="mt-4 space-y-2 text-sm text-ink-700">
            <li><Link href="/services" className="hover:text-ink-900">Services</Link></li>
            <li><Link href="/boutique" className="hover:text-ink-900">Boutique</Link></li>
            <li><Link href="/gallery" className="hover:text-ink-900">Galerie</Link></li>
            <li><Link href="/contact" className="hover:text-ink-900">Contact</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-ink-500">Contact</h3>
          <ul className="mt-4 space-y-3 text-sm text-ink-700">
            <li className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-gold-500" /> {BRAND.address}
            </li>
            <li>
              <a href={whatsappLink()} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-ink-900">
                <MessageCircle className="h-4 w-4 text-gold-500" /> WhatsApp
              </a>
            </li>
            <li>
              <a href={BRAND.instagram} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-ink-900">
                <AtSign className="h-4 w-4 text-gold-500" /> Instagram
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-nude-200/70 py-5 text-center text-xs text-ink-500">
        © {new Date().getFullYear()} {BRAND.name}. Tous droits réservés.
      </div>
    </footer>
  );
}
