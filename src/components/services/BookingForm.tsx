"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { MapPin, Building2 } from "lucide-react";
import clsx from "clsx";
import { useAuth } from "@/context/AuthContext";
import { createAppointment } from "@/lib/data/appointments";
import { Button, LinkButton } from "@/components/ui/Button";
import { formatFCFA } from "@/lib/format";
import { whatsappNumberDisplay } from "@/lib/config";
import type { Service } from "@/types/service";
import type { LocationType } from "@/types/appointment";

const DEPOSIT_RATIO = 0.25;

export function BookingForm({ service }: { service: Service }) {
  const { profile } = useAuth();
  const router = useRouter();
  const [locationType, setLocationType] = useState<LocationType>("studio");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [address, setAddress] = useState(profile?.address ?? "");
  const [district, setDistrict] = useState(profile?.district ?? "");
  const [gps, setGps] = useState("");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const deposit = Math.round((service.price * DEPOSIT_RATIO) / 500) * 500;
  const today = new Date().toISOString().slice(0, 10);

  if (!profile) {
    return (
      <div className="rounded-2xl border border-nude-200 bg-nude-50 p-6 text-center">
        <p className="text-ink-700">Connectez-vous pour réserver cette prestation.</p>
        <div className="mt-4 flex justify-center gap-3">
          <LinkButton href="/login" variant="primary" size="sm">Se connecter</LinkButton>
          <LinkButton href="/register" variant="outline" size="sm">Créer un compte</LinkButton>
        </div>
      </div>
    );
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!date || !time) {
      toast.error("Merci de choisir une date et une heure.");
      return;
    }
    if (locationType === "domicile" && (!address || !district)) {
      toast.error("Merci de renseigner votre adresse et votre quartier.");
      return;
    }
    setSubmitting(true);
    try {
      await createAppointment({
        userId: profile!.id,
        clientName: profile!.name,
        clientPhone: profile!.phone,
        serviceId: service.id,
        serviceName: service.name,
        servicePrice: service.price,
        date,
        time,
        locationType,
        address: locationType === "domicile" ? address : undefined,
        district: locationType === "domicile" ? district : undefined,
        gpsLocation: locationType === "domicile" && gps ? gps : undefined,
        depositAmount: deposit,
        notes: notes || undefined,
      });
      toast.success("Demande envoyée ! Nous vous contactons pour l'acompte.");
      router.push("/appointments");
    } catch {
      toast.error("Une erreur est survenue, réessayez.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 rounded-2xl border border-nude-200 bg-white p-6">
      <div>
        <span className="text-xs font-semibold uppercase tracking-wide text-ink-500">Lieu de la prestation</span>
        <div className="mt-2 grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => setLocationType("studio")}
            className={clsx(
              "flex flex-col items-center gap-2 rounded-xl border p-4 text-sm transition-colors",
              locationType === "studio" ? "border-ink-900 bg-nude-50" : "border-nude-200 text-ink-500"
            )}
          >
            <Building2 className="h-5 w-5" /> Au studio
          </button>
          <button
            type="button"
            onClick={() => setLocationType("domicile")}
            className={clsx(
              "flex flex-col items-center gap-2 rounded-xl border p-4 text-sm transition-colors",
              locationType === "domicile" ? "border-ink-900 bg-nude-50" : "border-nude-200 text-ink-500"
            )}
          >
            <MapPin className="h-5 w-5" /> À domicile
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <label className="block text-sm">
          Date
          <input
            type="date"
            required
            min={today}
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="mt-1 w-full rounded-lg border border-nude-200 px-3 py-2.5 text-sm outline-none focus:border-ink-900"
          />
        </label>
        <label className="block text-sm">
          Heure
          <input
            type="time"
            required
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className="mt-1 w-full rounded-lg border border-nude-200 px-3 py-2.5 text-sm outline-none focus:border-ink-900"
          />
        </label>
      </div>

      {locationType === "domicile" && (
        <div className="space-y-3 rounded-xl bg-nude-50 p-4">
          <label className="block text-sm">
            Adresse
            <input
              required
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Villa, rue, numéro…"
              className="mt-1 w-full rounded-lg border border-nude-200 px-3 py-2.5 text-sm outline-none focus:border-ink-900"
            />
          </label>
          <label className="block text-sm">
            Quartier
            <input
              required
              value={district}
              onChange={(e) => setDistrict(e.target.value)}
              className="mt-1 w-full rounded-lg border border-nude-200 px-3 py-2.5 text-sm outline-none focus:border-ink-900"
            />
          </label>
          <label className="block text-sm">
            Localisation GPS <span className="text-ink-500">(optionnel)</span>
            <input
              value={gps}
              onChange={(e) => setGps(e.target.value)}
              placeholder="lien Google Maps ou coordonnées"
              className="mt-1 w-full rounded-lg border border-nude-200 px-3 py-2.5 text-sm outline-none focus:border-ink-900"
            />
          </label>
        </div>
      )}

      <label className="block text-sm">
        Précisions <span className="text-ink-500">(optionnel)</span>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={2}
          className="mt-1 w-full rounded-lg border border-nude-200 px-3 py-2.5 text-sm outline-none focus:border-ink-900"
        />
      </label>

      <div className="rounded-xl bg-gold-300/20 p-4 text-sm text-ink-700">
        Un acompte de <strong>{formatFCFA(deposit)}</strong> vous sera demandé par WhatsApp au{" "}
        <strong>{whatsappNumberDisplay()}</strong> pour confirmer votre créneau. La réservation reste en attente
        jusqu&apos;à validation par notre équipe.
      </div>

      <Button type="submit" variant="primary" size="lg" className="w-full" disabled={submitting}>
        {submitting ? "Envoi…" : "Envoyer ma demande de réservation"}
      </Button>
    </form>
  );
}
