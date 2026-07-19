"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Clock } from "lucide-react";
import { CategoryArt } from "@/components/ui/CategoryArt";
import { BookingForm } from "@/components/services/BookingForm";
import { getService } from "@/lib/data/services";
import { formatFCFA, formatDuration } from "@/lib/format";
import { SERVICE_CATEGORY_LABELS, type Service } from "@/types/service";

export function ServiceDetail({ id }: { id: string }) {
  const [service, setService] = useState<Service | null | undefined>(undefined);

  useEffect(() => {
    getService(id).then(setService);
  }, [id]);

  if (service === undefined) {
    return (
      <div className="grid gap-10 lg:grid-cols-2">
        <div className="aspect-[4/3] animate-pulse rounded-2xl bg-nude-100" />
        <div className="h-96 animate-pulse rounded-2xl bg-nude-100" />
      </div>
    );
  }

  if (service === null) {
    return <p className="text-ink-500">Ce service est introuvable ou n&apos;est plus disponible.</p>;
  }

  return (
    <div className="grid gap-10 lg:grid-cols-2">
      <div>
        <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
          {service.imageUrl ? (
            <Image src={service.imageUrl} alt={service.name} fill className="object-cover" />
          ) : (
            <CategoryArt category={service.category} />
          )}
        </div>
        <div className="mt-6 space-y-4">
          <span className="rounded-full bg-nude-100 px-3 py-1 text-xs font-medium uppercase tracking-wide text-ink-700">
            {SERVICE_CATEGORY_LABELS[service.category]}
          </span>
          <h1 className="font-display text-3xl text-ink-900">{service.name}</h1>
          <p className="leading-relaxed text-ink-500">{service.description}</p>
          <div className="flex items-center gap-6 pt-2">
            <span className="flex items-center gap-2 text-sm text-ink-700">
              <Clock className="h-4 w-4" /> {formatDuration(service.duration)}
            </span>
            <span className="text-xl font-semibold text-gold-600">{formatFCFA(service.price)}</span>
          </div>
        </div>
      </div>

      <BookingForm service={service} />
    </div>
  );
}
