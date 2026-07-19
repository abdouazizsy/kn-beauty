"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { CategoryArt } from "@/components/ui/CategoryArt";
import { Container, SectionHeading } from "@/components/ui/Container";
import { LinkButton } from "@/components/ui/Button";
import { OrderStatusBadge } from "@/components/ui/StatusBadge";
import { useAuth } from "@/context/AuthContext";
import { listOrdersForUser } from "@/lib/data/orders";
import { formatDate, formatFCFA } from "@/lib/format";
import type { Order } from "@/types/order";

export default function OrdersPage() {
  const { profile } = useAuth();
  const [orders, setOrders] = useState<Order[] | null>(null);

  useEffect(() => {
    if (!profile) return;
    listOrdersForUser(profile.id).then(setOrders);
  }, [profile]);

  return (
    <Container className="py-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <SectionHeading eyebrow="Espace cliente" title="Mes commandes" />
        <LinkButton href="/boutique" variant="primary" size="sm">Continuer mes achats</LinkButton>
      </div>

      <div className="mt-8 space-y-4">
        {orders === null ? (
          Array.from({ length: 3 }).map((_, i) => <div key={i} className="h-32 animate-pulse rounded-2xl bg-nude-100" />)
        ) : orders.length === 0 ? (
          <div className="rounded-2xl border border-nude-200 bg-white p-10 text-center text-ink-500">
            Vous n&apos;avez pas encore passé de commande.
          </div>
        ) : (
          orders.map((order) => (
            <div key={order.id} className="rounded-2xl border border-nude-200 bg-white p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-xs text-ink-500">{formatDate(order.createdAt)}</p>
                  <p className="font-display text-lg text-ink-900">{formatFCFA(order.totalAmount)}</p>
                  <p className="text-sm text-ink-500">Livraison : {order.deliveryAddress}, {order.district}</p>
                </div>
                <OrderStatusBadge status={order.status} />
              </div>
              <div className="mt-4 flex gap-3 overflow-x-auto">
                {order.products.map((item, i) => (
                  <div key={i} className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg">
                    {item.imageUrl ? (
                      <Image src={item.imageUrl} alt={item.productName} fill className="object-cover" />
                    ) : (
                      <CategoryArt />
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </Container>
  );
}
