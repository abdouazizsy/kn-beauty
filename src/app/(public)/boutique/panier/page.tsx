"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, Trash2 } from "lucide-react";
import { CategoryArt } from "@/components/ui/CategoryArt";
import { Container, SectionHeading } from "@/components/ui/Container";
import { LinkButton } from "@/components/ui/Button";
import { useCartStore } from "@/lib/cart-store";
import { formatFCFA } from "@/lib/format";

export default function CartPage() {
  const items = useCartStore((s) => s.items);
  const setQuantity = useCartStore((s) => s.setQuantity);
  const removeItem = useCartStore((s) => s.removeItem);
  const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  return (
    <Container className="py-16">
      <SectionHeading eyebrow="Boutique" title="Mon panier" />

      {items.length === 0 ? (
        <div className="mt-10 rounded-2xl border border-nude-200 bg-nude-50 p-10 text-center">
          <p className="text-ink-500">Votre panier est vide pour le moment.</p>
          <LinkButton href="/boutique" variant="primary" size="md" className="mt-4">
            Découvrir la boutique
          </LinkButton>
        </div>
      ) : (
        <div className="mt-10 grid gap-10 lg:grid-cols-3">
          <div className="space-y-4 lg:col-span-2">
            {items.map((item) => (
              <div
                key={`${item.productId}-${item.size}-${item.color}`}
                className="flex gap-4 rounded-2xl border border-nude-200 bg-white p-4"
              >
                <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl">
                  {item.imageUrl ? (
                    <Image src={item.imageUrl} alt={item.productName} fill className="object-cover" />
                  ) : (
                    <CategoryArt />
                  )}
                </div>
                <div className="flex flex-1 flex-col justify-between">
                  <div>
                    <h3 className="font-display text-base text-ink-900">{item.productName}</h3>
                    <p className="text-xs text-ink-500">
                      {[item.size, item.color].filter(Boolean).join(" · ")}
                    </p>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 rounded-full border border-nude-200 px-2 py-1">
                      <button
                        onClick={() => setQuantity(item.productId, item.size, item.color, item.quantity - 1)}
                        className="flex h-7 w-7 items-center justify-center rounded-full hover:bg-nude-100"
                      >
                        <Minus className="h-3.5 w-3.5" />
                      </button>
                      <span className="w-5 text-center text-sm">{item.quantity}</span>
                      <button
                        onClick={() => setQuantity(item.productId, item.size, item.color, item.quantity + 1)}
                        className="flex h-7 w-7 items-center justify-center rounded-full hover:bg-nude-100"
                      >
                        <Plus className="h-3.5 w-3.5" />
                      </button>
                    </div>
                    <span className="font-semibold text-gold-600">{formatFCFA(item.price * item.quantity)}</span>
                  </div>
                </div>
                <button
                  onClick={() => removeItem(item.productId, item.size, item.color)}
                  className="self-start text-ink-500 hover:text-blush-500"
                  aria-label="Retirer"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>

          <div className="h-fit space-y-4 rounded-2xl border border-nude-200 bg-nude-50 p-6">
            <div className="flex items-center justify-between text-sm text-ink-700">
              <span>Sous-total</span>
              <span>{formatFCFA(total)}</span>
            </div>
            <div className="flex items-center justify-between font-semibold text-ink-900">
              <span>Total</span>
              <span>{formatFCFA(total)}</span>
            </div>
            <LinkButton href="/boutique/commander" variant="primary" size="lg" className="w-full">
              Passer la commande
            </LinkButton>
            <Link href="/boutique" className="block text-center text-sm text-ink-500 hover:text-ink-900">
              Continuer mes achats
            </Link>
          </div>
        </div>
      )}
    </Container>
  );
}
