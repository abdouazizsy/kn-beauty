"use client";

import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { Building2, MapPin, Trash2 } from "lucide-react";
import clsx from "clsx";
import { listAppointments, updateAppointment, deleteAppointment } from "@/lib/data/appointments";
import { AppointmentStatusBadge } from "@/components/ui/StatusBadge";
import { Button } from "@/components/ui/Button";
import { formatDate, formatFCFA } from "@/lib/format";
import type { Appointment, LocationType } from "@/types/appointment";

const FILTERS: { key: LocationType | "tous"; label: string }[] = [
  { key: "tous", label: "Tous" },
  { key: "studio", label: "Au studio" },
  { key: "domicile", label: "À domicile" },
];

export default function AdminAppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[] | null>(null);
  const [filter, setFilter] = useState<LocationType | "tous">("tous");

  function refresh() {
    listAppointments().then(setAppointments);
  }

  useEffect(refresh, []);

  const filtered = useMemo(() => {
    if (!appointments) return null;
    return filter === "tous" ? appointments : appointments.filter((a) => a.locationType === filter);
  }, [appointments, filter]);

  async function markDepositReceived(apt: Appointment) {
    await updateAppointment(apt.id, { depositStatus: "RECEIVED", status: "DEPOSIT_RECEIVED" });
    toast.success("Acompte marqué comme reçu.");
    refresh();
  }

  async function validate(apt: Appointment) {
    await updateAppointment(apt.id, { status: "CONFIRMED" });
    toast.success("Rendez-vous confirmé.");
    refresh();
  }

  async function refuse(apt: Appointment) {
    if (!confirm("Refuser cette demande de réservation ?")) return;
    await updateAppointment(apt.id, { status: "CANCELLED" });
    toast.success("Réservation refusée.");
    refresh();
  }

  async function markCompleted(apt: Appointment) {
    await updateAppointment(apt.id, { status: "COMPLETED" });
    toast.success("Prestation marquée comme terminée.");
    refresh();
  }

  async function remove(apt: Appointment) {
    if (!confirm(`Supprimer définitivement ce rendez-vous (${apt.clientName} — ${apt.serviceName}) ?`)) return;
    await deleteAppointment(apt.id);
    toast.success("Rendez-vous supprimé.");
    refresh();
  }

  return (
    <div>
      <h1 className="font-display text-2xl text-ink-900">Rendez-vous</h1>
      <p className="text-ink-500">Validez les réservations après réception de l&apos;acompte.</p>

      <div className="mt-6 flex gap-2">
        {FILTERS.map((f) => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={clsx(
              "rounded-full border px-4 py-2 text-sm",
              filter === f.key ? "border-ink-900 bg-ink-900 text-cream" : "border-nude-200 text-ink-700"
            )}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="mt-6 space-y-4">
        {filtered === null ? (
          Array.from({ length: 3 }).map((_, i) => <div key={i} className="h-32 animate-pulse rounded-2xl bg-white" />)
        ) : filtered.length === 0 ? (
          <div className="rounded-2xl border border-nude-200 bg-white p-10 text-center text-ink-500">Aucun rendez-vous.</div>
        ) : (
          filtered.map((apt) => (
            <div key={apt.id} className="rounded-2xl border border-nude-200 bg-white p-5">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="font-display text-lg text-ink-900">{apt.clientName}</p>
                  <p className="text-sm text-ink-500">{apt.clientPhone}</p>
                  <p className="mt-1 text-sm text-ink-700">{apt.serviceName} — {formatFCFA(apt.servicePrice)}</p>
                  <p className="text-sm text-ink-500">{formatDate(apt.date)} à {apt.time}</p>
                  <p className="mt-1 flex items-center gap-1.5 text-sm text-ink-500">
                    {apt.locationType === "studio" ? <Building2 className="h-4 w-4" /> : <MapPin className="h-4 w-4" />}
                    {apt.locationType === "studio" ? "Au studio" : `${apt.address}, ${apt.district}`}
                  </p>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <div className="flex items-center gap-2">
                    <AppointmentStatusBadge status={apt.status} />
                    <button
                      onClick={() => remove(apt)}
                      className="rounded-full p-1.5 text-ink-500 hover:bg-blush-100 hover:text-blush-500"
                      aria-label="Supprimer le rendez-vous"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                  <span className="text-sm text-ink-700">
                    Acompte {formatFCFA(apt.depositAmount)} — {apt.depositStatus === "RECEIVED" ? "reçu" : "en attente"}
                  </span>
                  <span className="text-sm text-ink-500">
                    Reste à payer : <strong className="text-ink-700">{formatFCFA(apt.servicePrice - apt.depositAmount)}</strong>
                  </span>
                  <div className="flex gap-2">
                    {apt.status === "PENDING" && (
                      <Button onClick={() => markDepositReceived(apt)} variant="outline" size="sm">Acompte reçu</Button>
                    )}
                    {apt.status === "DEPOSIT_RECEIVED" && (
                      <>
                        <Button onClick={() => validate(apt)} variant="primary" size="sm">Valider</Button>
                        <Button onClick={() => refuse(apt)} variant="outline" size="sm">Refuser</Button>
                      </>
                    )}
                    {apt.status === "CONFIRMED" && (
                      <Button onClick={() => markCompleted(apt)} variant="gold" size="sm">Terminé</Button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
