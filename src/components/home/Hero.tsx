import Image from "next/image";
import { LinkButton } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { BRAND } from "@/lib/config";

const HERO_IMAGE_DESKTOP = "/hero-salon.png";
const HERO_IMAGE_MOBILE =
  "https://res.cloudinary.com/dvratnou1/image/upload/v1784474084/zh4vmmfdrqyajf0uebqt.jpg";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-blush-200 via-nude-100 to-cream">
      <Image src={HERO_IMAGE_MOBILE} alt="" fill priority className="object-cover sm:hidden" />
      <Image src={HERO_IMAGE_DESKTOP} alt="" fill priority className="hidden object-cover sm:block" />
      <div className="absolute inset-0 bg-gradient-to-b from-ink-900/50 via-ink-900/10 to-cream" />

      <Container className="relative flex flex-col items-center gap-6 py-24 text-center sm:py-32">
        <span className="animate-fade-up rounded-full border border-gold-400/50 bg-white/70 px-4 py-1.5 text-xs font-medium uppercase tracking-[0.25em] text-gold-600 backdrop-blur-sm">
          {BRAND.studioName}
        </span>
        <h1 className="animate-fade-up font-display text-4xl leading-tight text-white drop-shadow-md sm:text-6xl">
          {BRAND.tagline}
        </h1>
        <p className="max-w-xl animate-fade-up text-balance text-white/90 drop-shadow sm:text-lg">
          {BRAND.description}
        </p>
        <div className="flex animate-fade-up flex-wrap items-center justify-center gap-3 pt-2">
          <LinkButton href="/services" variant="primary" size="lg">Réserver une prestation</LinkButton>
          <LinkButton href="/boutique" variant="gold" size="lg">Découvrir la boutique</LinkButton>
        </div>
      </Container>
    </section>
  );
}
