"use client";

import { useEffect, useMemo, useState } from "react";
import clsx from "clsx";
import { listGalleryItems } from "@/lib/data/gallery";
import { CategoryArt } from "@/components/ui/CategoryArt";
import { GALLERY_CATEGORY_LABELS, type GalleryCategory, type GalleryItem } from "@/types/gallery";

const CATEGORIES: (GalleryCategory | "tous")[] = ["tous", "maquillage", "coiffure", "ongles", "avant-apres"];

export function GalleryGrid() {
  const [items, setItems] = useState<GalleryItem[] | null>(null);
  const [active, setActive] = useState<GalleryCategory | "tous">("tous");

  useEffect(() => {
    listGalleryItems().then(setItems);
  }, []);

  const filtered = useMemo(() => {
    if (!items) return null;
    return active === "tous" ? items : items.filter((g) => g.category === active);
  }, [items, active]);

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setActive(cat)}
            className={clsx(
              "rounded-full border px-4 py-2 text-sm transition-colors",
              active === cat
                ? "border-ink-900 bg-ink-900 text-cream"
                : "border-nude-200 text-ink-700 hover:border-ink-900/40"
            )}
          >
            {cat === "tous" ? "Tout" : GALLERY_CATEGORY_LABELS[cat]}
          </button>
        ))}
      </div>

      <div className="mt-10 columns-2 gap-4 sm:columns-3">
        {filtered
          ? filtered.map((item) => (
              <div key={item.id} className="mb-4 aspect-square break-inside-avoid overflow-hidden rounded-2xl">
                {item.imageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={item.imageUrl} alt={item.title} className="h-full w-full object-cover" />
                ) : (
                  <CategoryArt category={item.category} label={item.title} />
                )}
              </div>
            ))
          : Array.from({ length: 9 }).map((_, i) => (
              <div key={i} className="mb-4 aspect-square animate-pulse break-inside-avoid rounded-2xl bg-nude-100" />
            ))}
      </div>
    </div>
  );
}
