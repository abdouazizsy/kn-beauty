"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import toast from "react-hot-toast";
import { Minus, Plus } from "lucide-react";
import clsx from "clsx";
import { CategoryArt } from "@/components/ui/CategoryArt";
import { Button } from "@/components/ui/Button";
import { getProduct } from "@/lib/data/products";
import { useCartStore } from "@/lib/cart-store";
import { formatFCFA } from "@/lib/format";
import { PRODUCT_CATEGORY_LABELS, type Product } from "@/types/product";

export function ProductDetail({ id }: { id: string }) {
  const [product, setProduct] = useState<Product | null | undefined>(undefined);
  const [size, setSize] = useState<string | undefined>();
  const [color, setColor] = useState<string | undefined>();
  const [quantity, setQuantity] = useState(1);
  const addItem = useCartStore((s) => s.addItem);

  useEffect(() => {
    getProduct(id).then((p) => {
      setProduct(p);
      if (p?.sizes[0]) setSize(p.sizes[0]);
      if (p?.colors[0]) setColor(p.colors[0]);
    });
  }, [id]);

  if (product === undefined) {
    return (
      <div className="grid gap-10 lg:grid-cols-2">
        <div className="aspect-square animate-pulse rounded-2xl bg-nude-100" />
        <div className="h-96 animate-pulse rounded-2xl bg-nude-100" />
      </div>
    );
  }

  if (product === null) {
    return <p className="text-ink-500">Ce produit est introuvable ou n&apos;est plus disponible.</p>;
  }

  const outOfStock = product.stock <= 0;

  function handleAddToCart() {
    if (!product) return;
    addItem({
      productId: product.id,
      productName: product.name,
      imageUrl: product.images[0] ?? "",
      price: product.price,
      quantity,
      size,
      color,
    });
    toast.success("Ajouté au panier");
  }

  return (
    <div className="grid gap-10 lg:grid-cols-2">
      <div className="relative aspect-square overflow-hidden rounded-2xl">
        {product.images[0] ? (
          <Image src={product.images[0]} alt={product.name} fill className="object-cover" />
        ) : (
          <CategoryArt category={product.category} />
        )}
      </div>

      <div className="space-y-5">
        <span className="rounded-full bg-nude-100 px-3 py-1 text-xs font-medium uppercase tracking-wide text-ink-700">
          {PRODUCT_CATEGORY_LABELS[product.category]}
        </span>
        <h1 className="font-display text-3xl text-ink-900">{product.name}</h1>
        <p className="leading-relaxed text-ink-500">{product.description}</p>
        <span className="block text-xl font-semibold text-gold-600">{formatFCFA(product.price)}</span>

        {product.sizes.length > 0 && (
          <div>
            <span className="text-xs font-semibold uppercase tracking-wide text-ink-500">Taille</span>
            <div className="mt-2 flex flex-wrap gap-2">
              {product.sizes.map((s) => (
                <button
                  key={s}
                  onClick={() => setSize(s)}
                  className={clsx(
                    "rounded-full border px-4 py-1.5 text-sm",
                    size === s ? "border-ink-900 bg-ink-900 text-cream" : "border-nude-200 text-ink-700"
                  )}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {product.colors.length > 0 && (
          <div>
            <span className="text-xs font-semibold uppercase tracking-wide text-ink-500">Couleur</span>
            <div className="mt-2 flex flex-wrap gap-2">
              {product.colors.map((c) => (
                <button
                  key={c}
                  onClick={() => setColor(c)}
                  className={clsx(
                    "rounded-full border px-4 py-1.5 text-sm",
                    color === c ? "border-ink-900 bg-ink-900 text-cream" : "border-nude-200 text-ink-700"
                  )}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>
        )}

        <div>
          <span className="text-xs font-semibold uppercase tracking-wide text-ink-500">Quantité</span>
          <div className="mt-2 flex w-fit items-center gap-3 rounded-full border border-nude-200 px-2 py-1">
            <button
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-nude-100"
              aria-label="Diminuer"
            >
              <Minus className="h-4 w-4" />
            </button>
            <span className="w-6 text-center text-sm">{quantity}</span>
            <button
              onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
              className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-nude-100"
              aria-label="Augmenter"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
        </div>

        <Button
          onClick={handleAddToCart}
          disabled={outOfStock}
          variant="primary"
          size="lg"
          className="w-full sm:w-auto"
        >
          {outOfStock ? "Rupture de stock" : "Ajouter au panier"}
        </Button>
      </div>
    </div>
  );
}
