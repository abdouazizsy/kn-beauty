"use client";

import { useEffect, useState } from "react";
import { Wallet, TrendingUp, ClipboardList, Users, Home, Building2 } from "lucide-react";
import { getDashboardStats, type DashboardStats } from "@/lib/data/stats";
import { RevenueChart } from "@/components/admin/RevenueChart";
import { AppointmentStatusBadge } from "@/components/ui/StatusBadge";
import { formatFCFA } from "@/lib/format";

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);

  useEffect(() => {
    getDashboardStats().then(setStats);
  }, []);

  if (!stats) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-28 animate-pulse rounded-2xl bg-white" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-2xl text-ink-900">Tableau de bord</h1>
        <p className="text-ink-500">Vue d&apos;ensemble de l&apos;activité KN Beauty Studio.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={Wallet} label="Chiffre d'affaires total" value={formatFCFA(stats.totalRevenue)} />
        <StatCard icon={TrendingUp} label="CA du mois" value={formatFCFA(stats.monthlyRevenue)} />
        <StatCard icon={ClipboardList} label="Commandes" value={stats.totalOrders} />
        <StatCard icon={Users} label="Clientes" value={stats.totalCustomers} />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="rounded-2xl border border-nude-200 bg-white p-6 lg:col-span-2">
          <h2 className="font-display text-lg text-ink-900">Évolution du revenu (6 derniers mois)</h2>
          <div className="mt-4">
            <RevenueChart data={stats.monthlySeries} />
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-2xl border border-nude-200 bg-white p-6">
            <h2 className="font-display text-base text-ink-900">Déplacements</h2>
            <div className="mt-4 space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-ink-700"><Building2 className="h-4 w-4" /> Au studio</span>
                <span className="font-semibold">{stats.studioVisits}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-ink-700"><Home className="h-4 w-4" /> À domicile</span>
                <span className="font-semibold">{stats.homeVisits}</span>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-nude-200 bg-white p-6">
            <h2 className="font-display text-base text-ink-900">Services populaires</h2>
            <ul className="mt-4 space-y-2 text-sm">
              {stats.popularServices.length === 0 && <li className="text-ink-500">Aucune donnée pour le moment.</li>}
              {stats.popularServices.map((s) => (
                <li key={s.name} className="flex items-center justify-between">
                  <span className="text-ink-700">{s.name}</span>
                  <span className="font-semibold">{s.count}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-nude-200 bg-white p-6">
          <h2 className="font-display text-lg text-ink-900">Rendez-vous du jour</h2>
          <div className="mt-4 space-y-3">
            {stats.appointmentsToday.length === 0 && <p className="text-sm text-ink-500">Aucun rendez-vous aujourd&apos;hui.</p>}
            {stats.appointmentsToday.map((a) => (
              <div key={a.id} className="flex items-center justify-between rounded-xl bg-nude-50 p-3 text-sm">
                <div>
                  <p className="font-medium text-ink-900">{a.clientName}</p>
                  <p className="text-ink-500">{a.serviceName} · {a.time}</p>
                </div>
                <AppointmentStatusBadge status={a.status} />
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-nude-200 bg-white p-6">
          <h2 className="font-display text-lg text-ink-900">Produits les plus vendus</h2>
          <div className="mt-4 space-y-3">
            {stats.topProducts.length === 0 && <p className="text-sm text-ink-500">Aucune vente pour le moment.</p>}
            {stats.topProducts.map((p) => (
              <div key={p.name} className="flex items-center justify-between text-sm">
                <span className="text-ink-700">{p.name}</span>
                <span className="font-semibold">{p.quantity} vendus</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, label, value }: { icon: typeof Wallet; label: string; value: string | number }) {
  return (
    <div className="rounded-2xl border border-nude-200 bg-white p-5">
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gold-300/30">
        <Icon className="h-5 w-5 text-gold-600" />
      </div>
      <p className="mt-3 text-xs uppercase tracking-wide text-ink-500">{label}</p>
      <p className="font-display text-xl text-ink-900">{value}</p>
    </div>
  );
}
