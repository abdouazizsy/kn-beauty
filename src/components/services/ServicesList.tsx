"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import clsx from "clsx";
import { listServices } from "@/lib/data/services";
import { ServiceCard } from "@/components/shared/ServiceCard";
import { SERVICE_CATEGORY_LABELS, type Service, type ServiceCategory } from "@/types/service";

const CATEGORIES: (ServiceCategory | "tous")[] = ["tous", "maquillage", "coiffure", "onglerie", "beaute"];

export function ServicesList() {
  const [services, setServices] = useState<Service[] | null>(null);
  const searchParams = useSearchParams();
  const router = useRouter();
  const active = (searchParams.get("category") as ServiceCategory | null) ?? "tous";

  useEffect(() => {
    listServices().then(setServices);
  }, []);

  const filtered = useMemo(() => {
    if (!services) return null;
    const visible = services.filter((s) => s.active);
    return active === "tous" ? visible : visible.filter((s) => s.category === active);
  }, [services, active]);

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => router.push(cat === "tous" ? "/services" : `/services?category=${cat}`)}
            className={clsx(
              "rounded-full border px-4 py-2 text-sm transition-colors",
              active === cat
                ? "border-ink-900 bg-ink-900 text-cream"
                : "border-nude-200 text-ink-700 hover:border-ink-900/40"
            )}
          >
            {cat === "tous" ? "Tous les services" : SERVICE_CATEGORY_LABELS[cat]}
          </button>
        ))}
      </div>

      <div className="mt-10">
        {filtered ? (
          filtered.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((s) => (
                <ServiceCard key={s.id} service={s} />
              ))}
            </div>
          ) : (
            <p className="text-ink-500">Aucun service dans cette catégorie pour le moment.</p>
          )
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-72 animate-pulse rounded-2xl bg-nude-100" />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
