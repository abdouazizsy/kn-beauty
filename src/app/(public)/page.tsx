import { Sparkles, ShieldCheck, MapPin, CalendarCheck } from "lucide-react";
import { LinkButton } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { WhatsAppButton } from "@/components/shared/WhatsAppButton";
import { HomeDynamicSections } from "@/components/home/HomeDynamicSections";
import { BRAND } from "@/lib/config";

const REASSURANCES = [
  { icon: ShieldCheck, title: "Validation soignée", text: "Chaque rendez-vous est vérifié par notre équipe avant confirmation." },
  { icon: MapPin, title: "Studio ou domicile", text: "Choisissez de venir au studio ou de recevoir la prestation chez vous." },
  { icon: CalendarCheck, title: "Suivi en temps réel", text: "Suivez le statut de vos réservations et commandes depuis votre espace." },
  { icon: Sparkles, title: "Produits sélectionnés", text: "Une boutique pensée pour prolonger l'expérience beauté à la maison." },
];

export default function HomePage() {
  return (
    <>
      <section className="relative overflow-hidden bg-gradient-to-b from-blush-100 via-nude-50 to-cream">
        <Container className="relative flex flex-col items-center gap-6 py-24 text-center sm:py-32">
          <span className="animate-fade-up rounded-full border border-gold-400/50 bg-white/60 px-4 py-1.5 text-xs font-medium uppercase tracking-[0.25em] text-gold-600">
            {BRAND.studioName}
          </span>
          <h1 className="animate-fade-up font-display text-4xl leading-tight text-ink-900 sm:text-6xl">
            {BRAND.tagline}
          </h1>
          <p className="max-w-xl animate-fade-up text-balance text-ink-500 sm:text-lg">{BRAND.description}</p>
          <div className="flex animate-fade-up flex-wrap items-center justify-center gap-3 pt-2">
            <LinkButton href="/services" variant="primary" size="lg">Réserver une prestation</LinkButton>
            <LinkButton href="/boutique" variant="outline" size="lg">Découvrir la boutique</LinkButton>
          </div>
        </Container>
      </section>

      <HomeDynamicSections />

      <section className="bg-ink-900 py-20 text-cream">
        <Container>
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
            {REASSURANCES.map((r) => (
              <div key={r.title} className="flex flex-col items-start gap-3">
                <r.icon className="h-6 w-6 text-gold-400" strokeWidth={1.5} />
                <h3 className="font-display text-lg">{r.title}</h3>
                <p className="text-sm text-cream/70">{r.text}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <section className="py-20">
        <Container className="flex flex-col items-center gap-6 rounded-3xl bg-gradient-to-br from-blush-100 via-nude-100 to-gold-300/40 px-6 py-16 text-center">
          <h2 className="font-display text-3xl text-ink-900 sm:text-4xl">Prête à vivre l&apos;expérience KN Beauty ?</h2>
          <p className="max-w-lg text-ink-700">
            Contactez-nous directement sur WhatsApp pour toute question, ou créez votre compte pour réserver en ligne.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <WhatsAppButton variant="inline" label="Écrire sur WhatsApp" />
            <LinkButton href="/register" variant="primary" size="md">Créer mon compte</LinkButton>
          </div>
        </Container>
      </section>
    </>
  );
}
