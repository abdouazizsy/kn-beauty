"use client";

import { useEffect, useState } from "react";
import { CalendarCheck, Package, Sparkles } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { LinkButton } from "@/components/ui/Button";
import { AppointmentStatusBadge, OrderStatusBadge } from "@/components/ui/StatusBadge";
import { useAuth } from "@/context/AuthContext";
import { listAppointmentsForUser } from "@/lib/data/appointments";
import { listOrdersForUser } from "@/lib/data/orders";
import { formatDate, formatFCFA } from "@/lib/format";
import type { Appointment } from "@/types/appointment";
import type { Order } from "@/types/order";

export default function ClientDashboardPage() {
  const { profile } = useAuth();
  const [appointments, setAppointments] = useState<Appointment[] | null>(null);
  const [orders, setOrders] = useState<Order[] | null>(null);

  useEffect(() => {
    if (!profile) return;
    listAppointmentsForUser(profile.id).then(setAppointments);
    listOrdersForUser(profile.id).then(setOrders);
  }, [profile]);

  const nextAppointment = appointments
    ?.filter((a) => a.status !== "CANCELLED" && a.status !== "COMPLETED")
    .sort((a, b) => +new Date(`${a.date}T${a.time}`) - +new Date(`${b.date}T${b.time}`))[0];

  return (
    <Container className="py-10">
      <h1 className="font-display text-2xl text-ink-900">
        Bonjour {profile?.name.split(" ")[0]} 👋
      </h1>
      <p className="mt-1 text-ink-500">Voici un aperçu de votre espace KN Beauty Studio.</p>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <StatCard icon={CalendarCheck} label="Rendez-vous" value={appointments?.length ?? "—"} />
        <StatCard icon={Package} label="Commandes" value={orders?.length ?? "—"} />
        <StatCard
          icon={Sparkles}
          label="Statut"
          value={profile?.role === "cliente" ? "Cliente KN Beauty" : "—"}
        />
      </div>

      <div className="mt-10 grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-nude-200 bg-white p-6">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-lg text-ink-900">Prochain rendez-vous</h2>
            <LinkButton href="/appointments" variant="ghost" size="sm">Tout voir</LinkButton>
          </div>
          {nextAppointment ? (
            <div className="mt-4 space-y-2 rounded-xl bg-nude-50 p-4">
              <div className="flex items-center justify-between">
                <span className="font-medium text-ink-900">{nextAppointment.serviceName}</span>
                <AppointmentStatusBadge status={nextAppointment.status} />
              </div>
              <p className="text-sm text-ink-500">
                {formatDate(nextAppointment.date)} à {nextAppointment.time}
              </p>
            </div>
          ) : (
            <div className="mt-4 rounded-xl bg-nude-50 p-4 text-sm text-ink-500">
              Aucun rendez-vous à venir.
              <LinkButton href="/services" variant="primary" size="sm" className="ml-2">Réserver</LinkButton>
            </div>
          )}
        </div>

        <div className="rounded-2xl border border-nude-200 bg-white p-6">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-lg text-ink-900">Dernière commande</h2>
            <LinkButton href="/orders" variant="ghost" size="sm">Tout voir</LinkButton>
          </div>
          {orders?.[0] ? (
            <div className="mt-4 space-y-2 rounded-xl bg-nude-50 p-4">
              <div className="flex items-center justify-between">
                <span className="font-medium text-ink-900">{formatFCFA(orders[0].totalAmount)}</span>
                <OrderStatusBadge status={orders[0].status} />
              </div>
              <p className="text-sm text-ink-500">{formatDate(orders[0].createdAt)}</p>
            </div>
          ) : (
            <div className="mt-4 rounded-xl bg-nude-50 p-4 text-sm text-ink-500">
              Aucune commande pour le moment.
              <LinkButton href="/boutique" variant="primary" size="sm" className="ml-2">Découvrir</LinkButton>
            </div>
          )}
        </div>
      </div>
    </Container>
  );
}

function StatCard({ icon: Icon, label, value }: { icon: typeof CalendarCheck; label: string; value: string | number }) {
  return (
    <div className="flex items-center gap-4 rounded-2xl border border-nude-200 bg-white p-5">
      <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gold-300/30">
        <Icon className="h-5 w-5 text-gold-600" />
      </div>
      <div>
        <p className="text-xs uppercase tracking-wide text-ink-500">{label}</p>
        <p className="font-display text-xl text-ink-900">{value}</p>
      </div>
    </div>
  );
}
