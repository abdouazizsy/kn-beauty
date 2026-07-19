"use client";

import { useEffect, useState } from "react";
import { listCustomerOverviews, type CustomerOverview } from "@/lib/data/customers";
import { formatDate, formatFCFA } from "@/lib/format";

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<CustomerOverview[] | null>(null);

  useEffect(() => {
    listCustomerOverviews().then(setCustomers);
  }, []);

  return (
    <div>
      <h1 className="font-display text-2xl text-ink-900">Clientes</h1>
      <p className="text-ink-500">Historique et dépenses de vos clientes.</p>

      <div className="mt-8 overflow-x-auto rounded-2xl border border-nude-200 bg-white">
        <table className="w-full min-w-[640px] text-sm">
          <thead className="border-b border-nude-200 text-left text-xs uppercase tracking-wide text-ink-500">
            <tr>
              <th className="px-4 py-3">Cliente</th>
              <th className="px-4 py-3">Contact</th>
              <th className="px-4 py-3">Commandes</th>
              <th className="px-4 py-3">Rendez-vous</th>
              <th className="px-4 py-3">Total dépensé</th>
              <th className="px-4 py-3">Cliente depuis</th>
            </tr>
          </thead>
          <tbody>
            {customers === null ? (
              <tr><td colSpan={6} className="px-4 py-8 text-center text-ink-500">Chargement…</td></tr>
            ) : customers.length === 0 ? (
              <tr><td colSpan={6} className="px-4 py-8 text-center text-ink-500">Aucune cliente pour le moment.</td></tr>
            ) : (
              customers.map(({ user, totalOrders, totalAppointments, totalSpent }) => (
                <tr key={user.id} className="border-b border-nude-100 last:border-0">
                  <td className="px-4 py-3 font-medium text-ink-900">{user.name}</td>
                  <td className="px-4 py-3 text-ink-700">
                    <div>{user.phone}</div>
                    {user.address && <div className="text-xs text-ink-500">{user.address}, {user.district}</div>}
                  </td>
                  <td className="px-4 py-3 text-ink-700">{totalOrders}</td>
                  <td className="px-4 py-3 text-ink-700">{totalAppointments}</td>
                  <td className="px-4 py-3 font-semibold text-gold-600">{formatFCFA(totalSpent)}</td>
                  <td className="px-4 py-3 text-ink-500">{formatDate(user.createdAt)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
