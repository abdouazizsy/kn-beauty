import type { Metadata } from "next";
import { AtSign, MapPin, MessageCircle, Clock } from "lucide-react";
import { Container, SectionHeading } from "@/components/ui/Container";
import { WhatsAppButton } from "@/components/shared/WhatsAppButton";
import { BRAND } from "@/lib/config";

export const metadata: Metadata = {
  title: "Contact",
  description: "Contactez KN Beauty Studio sur WhatsApp pour toute question ou demande de rendez-vous.",
};

const INFO = [
  { icon: MapPin, title: "Adresse", text: BRAND.address },
  { icon: Clock, title: "Horaires", text: "Lundi – Samedi, 9h00 – 19h00" },
  { icon: MessageCircle, title: "WhatsApp", text: "Réponse rapide sous 24h" },
  { icon: AtSign, title: "Instagram", text: "@knbeautystudio" },
];

export default function ContactPage() {
  return (
    <Container className="py-16">
      <SectionHeading
        eyebrow="Contact"
        title="Parlons de votre projet beauté"
        description="Le plus simple pour nous joindre reste WhatsApp — nous répondons rapidement à toutes vos questions."
        align="center"
      />

      <div className="mx-auto mt-12 grid max-w-3xl gap-4 sm:grid-cols-2">
        {INFO.map((item) => (
          <div key={item.title} className="flex items-start gap-3 rounded-2xl border border-nude-200 bg-white p-5">
            <item.icon className="mt-0.5 h-5 w-5 text-gold-500" strokeWidth={1.5} />
            <div>
              <h3 className="text-sm font-semibold text-ink-900">{item.title}</h3>
              <p className="text-sm text-ink-500">{item.text}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mx-auto mt-12 flex max-w-3xl flex-col items-center gap-4 rounded-3xl bg-gradient-to-br from-blush-100 via-nude-100 to-gold-300/40 px-6 py-12 text-center">
        <h2 className="font-display text-2xl text-ink-900">Une question, une envie particulière ?</h2>
        <p className="max-w-md text-ink-700">
          Écrivez-nous directement sur WhatsApp, notre équipe vous répond avec plaisir.
        </p>
        <WhatsAppButton variant="inline" label="Ouvrir la discussion WhatsApp" />
      </div>
    </Container>
  );
}
