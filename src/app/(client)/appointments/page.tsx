"use client";

import { useEffect, useState } from "react";
import { CalendarCheck, MapPin, Building2 } from "lucide-react";
import { Container, SectionHeading } from "@/components/ui/Container";
import { LinkButton } from "@/components/ui/Button";
import { AppointmentStatusBadge } from "@/components/ui/StatusBadge";
import { useAuth } from "@/context/AuthContext";
import { listAppointmentsForUser } from "@/lib/data/appointments";
import { formatDate, formatFCFA } from "@/lib/format";
import type { Appointment } from "@/types/appointment";

export default function AppointmentsPage() {
  const { profile } = useAuth();
  const [appointments, setAppointments] = useState<Appointment[] | null>(null);

  useEffect(() => {
    if (!profile) return;
    listAppointmentsForUser(profile.id).then(setAppointments);
  }, [profile]);

  return (
    <Container className="py-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <SectionHeading eyebrow="Espace cliente" title="Mes rendez-vous" />
        <LinkButton href="/services" variant="primary" size="sm">Nouvelle réservation</LinkButton>
      </div>

      <div className="mt-8 space-y-4">
        {appointments === null ? (
          Array.from({ length: 3 }).map((_, i) => <div key={i} className="h-32 animate-pulse rounded-2xl bg-nude-100" />)
        ) : appointments.length === 0 ? (
          <div className="rounded-2xl border border-nude-200 bg-white p-10 text-center text-ink-500">
            Vous n&apos;avez pas encore de rendez-vous.
          </div>
        ) : (
          appointments.map((apt) => (
            <div key={apt.id} className="rounded-2xl border border-nude-200 bg-white p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h3 className="font-display text-lg text-ink-900">{apt.serviceName}</h3>
                  <p className="mt-1 flex items-center gap-1.5 text-sm text-ink-500">
                    <CalendarCheck className="h-4 w-4" /> {formatDate(apt.date)} à {apt.time}
                  </p>
                  <p className="mt-1 flex items-center gap-1.5 text-sm text-ink-500">
                    {apt.locationType === "studio" ? (
                      <Building2 className="h-4 w-4" />
                    ) : (
                      <MapPin className="h-4 w-4" />
                    )}
                    {apt.locationType === "studio" ? "Au studio" : `À domicile — ${apt.address}, ${apt.district}`}
                  </p>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <AppointmentStatusBadge status={apt.status} />
                  <span className="text-sm text-ink-700">
                    Acompte : <strong>{formatFCFA(apt.depositAmount)}</strong>{" "}
                    {apt.depositStatus === "RECEIVED" ? "(reçu)" : "(à envoyer)"}
                  </span>
                  <span className="text-sm text-ink-500">
                    Reste à payer : <strong className="text-ink-700">{formatFCFA(apt.servicePrice - apt.depositAmount)}</strong>
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </Container>
  );
}
