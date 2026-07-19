"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Container, SectionHeading } from "@/components/ui/Container";
import { Button, LinkButton } from "@/components/ui/Button";
import { useAuth } from "@/context/AuthContext";
import { useCartStore } from "@/lib/cart-store";
import { createOrder } from "@/lib/data/orders";
import { formatFCFA } from "@/lib/format";
import type { AppUser } from "@/types/user";
import type { OrderItem } from "@/types/order";

export default function CheckoutPage() {
  const { profile, loading } = useAuth();
  const router = useRouter();
  const items = useCartStore((s) => s.items);

  useEffect(() => {
    if (!loading && !profile) router.push("/login?next=/boutique/commander");
  }, [loading, profile, router]);

  if (loading || !profile) {
    return (
      <Container className="py-16">
        <div className="h-40 animate-pulse rounded-2xl bg-nude-100" />
      </Container>
    );
  }

  if (items.length === 0) {
    return (
      <Container className="py-16 text-center">
        <p className="text-ink-500">Votre panier est vide.</p>
        <LinkButton href="/boutique" variant="primary" size="md" className="mt-4">
          Découvrir la boutique
        </LinkButton>
      </Container>
    );
  }

  return (
    <Container className="py-16">
      <SectionHeading eyebrow="Boutique" title="Finaliser ma commande" />
      <CheckoutForm profile={profile} items={items} />
    </Container>
  );
}

function CheckoutForm({ profile, items }: { profile: AppUser; items: OrderItem[] }) {
  const router = useRouter();
  const clear = useCartStore((s) => s.clear);
  const [address, setAddress] = useState(profile.address ?? "");
  const [district, setDistrict] = useState(profile.district ?? "");
  const [submitting, setSubmitting] = useState(false);
  const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    try {
      await createOrder({
        userId: profile.id,
        clientName: profile.name,
        clientPhone: profile.phone,
        products: items,
        totalAmount: total,
        deliveryAddress: address,
        district,
      });
      clear();
      toast.success("Commande envoyée ! Nous vous contactons pour la livraison.");
      router.push("/orders");
    } catch {
      toast.error("Une erreur est survenue, réessayez.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="mt-10 grid gap-10 lg:grid-cols-3">
      <form onSubmit={handleSubmit} className="space-y-4 rounded-2xl border border-nude-200 bg-white p-6 lg:col-span-2">
        <label className="block text-sm">
          Adresse de livraison
          <input
            required
            value={address}
            onChange={(e) => setAddress(e.target.value)}
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
        <Button type="submit" variant="primary" size="lg" className="w-full" disabled={submitting}>
          {submitting ? "Envoi…" : `Confirmer ma commande — ${formatFCFA(total)}`}
        </Button>
      </form>

      <div className="h-fit space-y-3 rounded-2xl border border-nude-200 bg-nude-50 p-6">
        <h3 className="font-display text-lg text-ink-900">Récapitulatif</h3>
        {items.map((item) => (
          <div key={`${item.productId}-${item.size}-${item.color}`} className="flex justify-between text-sm text-ink-700">
            <span>{item.productName} × {item.quantity}</span>
            <span>{formatFCFA(item.price * item.quantity)}</span>
          </div>
        ))}
        <div className="flex justify-between border-t border-nude-200 pt-3 font-semibold text-ink-900">
          <span>Total</span>
          <span>{formatFCFA(total)}</span>
        </div>
      </div>
    </div>
  );
}
