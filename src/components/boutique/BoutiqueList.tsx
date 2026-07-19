"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Search } from "lucide-react";
import clsx from "clsx";
import { listProducts } from "@/lib/data/products";
import { ProductCard } from "@/components/shared/ProductCard";
import { PRODUCT_CATEGORY_LABELS, type Product, type ProductCategory } from "@/types/product";

const CATEGORIES: (ProductCategory | "tous")[] = ["tous", "pyjamas", "accessoires", "produits-beaute"];

export function BoutiqueList() {
  const [products, setProducts] = useState<Product[] | null>(null);
  const [search, setSearch] = useState("");
  const searchParams = useSearchParams();
  const router = useRouter();
  const active = (searchParams.get("category") as ProductCategory | null) ?? "tous";

  useEffect(() => {
    listProducts().then(setProducts);
  }, []);

  const filtered = useMemo(() => {
    if (!products) return null;
    let visible = products.filter((p) => p.active);
    if (active !== "tous") visible = visible.filter((p) => p.category === active);
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      visible = visible.filter((p) => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q));
    }
    return visible;
  }, [products, active, search]);

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => router.push(cat === "tous" ? "/boutique" : `/boutique?category=${cat}`)}
              className={clsx(
                "rounded-full border px-4 py-2 text-sm transition-colors",
                active === cat
                  ? "border-ink-900 bg-ink-900 text-cream"
                  : "border-nude-200 text-ink-700 hover:border-ink-900/40"
              )}
            >
              {cat === "tous" ? "Tous les produits" : PRODUCT_CATEGORY_LABELS[cat]}
            </button>
          ))}
        </div>
        <div className="relative w-full sm:w-64">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-500" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher un produit…"
            className="w-full rounded-full border border-nude-200 bg-white py-2.5 pl-9 pr-4 text-sm outline-none focus:border-ink-900"
          />
        </div>
      </div>

      <div className="mt-10">
        {filtered ? (
          filtered.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {filtered.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          ) : (
            <p className="text-ink-500">Aucun produit ne correspond à votre recherche.</p>
          )
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="h-72 animate-pulse rounded-2xl bg-nude-100" />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
