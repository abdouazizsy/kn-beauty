import Link from "next/link";
import { BRAND } from "@/lib/config";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-blush-100 via-nude-50 to-cream px-4 py-12">
      <Link href="/" className="mb-8 flex flex-col items-center leading-none">
        <span className="font-display text-2xl text-ink-900">KN Beauty</span>
        <span className="text-[10px] uppercase tracking-[0.3em] text-gold-600">{BRAND.studioName}</span>
      </Link>
      <div className="w-full max-w-md rounded-3xl border border-nude-200/70 bg-white/90 p-8 shadow-sm shadow-nude-300/30 backdrop-blur">
        {children}
      </div>
    </div>
  );
}
