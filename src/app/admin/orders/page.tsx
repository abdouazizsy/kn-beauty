"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { listOrders, updateOrderStatus } from "@/lib/data/orders";
import { OrderStatusBadge } from "@/components/ui/StatusBadge";
import { formatDate, formatFCFA } from "@/lib/format";
import { ORDER_STATUS_LABELS, type Order, type OrderStatus } from "@/types/order";

const STATUSES = Object.keys(ORDER_STATUS_LABELS) as OrderStatus[];

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[] | null>(null);

  function refresh() {
    listOrders().then(setOrders);
  }

  useEffect(refresh, []);

  async function handleStatusChange(id: string, status: OrderStatus) {
    await updateOrderStatus(id, status);
    toast.success("Statut mis à jour.");
    refresh();
  }

  return (
    <div>
      <h1 className="font-display text-2xl text-ink-900">Commandes</h1>
      <p className="text-ink-500">Suivez et mettez à jour le statut des commandes clientes.</p>

      <div className="mt-8 space-y-4">
        {orders === null ? (
          Array.from({ length: 3 }).map((_, i) => <div key={i} className="h-28 animate-pulse rounded-2xl bg-white" />)
        ) : orders.length === 0 ? (
          <div className="rounded-2xl border border-nude-200 bg-white p-10 text-center text-ink-500">Aucune commande.</div>
        ) : (
          orders.map((order) => (
            <div key={order.id} className="rounded-2xl border border-nude-200 bg-white p-5">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="font-display text-lg text-ink-900">{order.clientName}</p>
                  <p className="text-sm text-ink-500">{order.clientPhone} · {formatDate(order.createdAt)}</p>
                  <p className="mt-1 text-sm text-ink-700">
                    {order.products.map((p) => `${p.productName} ×${p.quantity}`).join(", ")}
                  </p>
                  <p className="mt-1 text-sm text-ink-500">Livraison : {order.deliveryAddress}, {order.district}</p>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <span className="font-semibold text-gold-600">{formatFCFA(order.totalAmount)}</span>
                  <OrderStatusBadge status={order.status} />
                  <select
                    value={order.status}
                    onChange={(e) => handleStatusChange(order.id, e.target.value as OrderStatus)}
                    className="rounded-lg border border-nude-200 px-2 py-1.5 text-xs"
                  >
                    {STATUSES.map((s) => (
                      <option key={s} value={s}>{ORDER_STATUS_LABELS[s]}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
