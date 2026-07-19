import Image from "next/image";
import Link from "next/link";
import { Clock } from "lucide-react";
import { CategoryArt } from "@/components/ui/CategoryArt";
import { formatFCFA, formatDuration } from "@/lib/format";
import { SERVICE_CATEGORY_LABELS, type Service } from "@/types/service";

export function ServiceCard({ service }: { service: Service }) {
  return (
    <Link
      href={`/services/${service.id}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-nude-200/70 bg-white transition-shadow hover:shadow-lg hover:shadow-nude-300/30"
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden">
        {service.imageUrl ? (
          <Image
            src={service.imageUrl}
            alt={service.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <CategoryArt category={service.category} className="transition-transform duration-500 group-hover:scale-105" />
        )}
        <span className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-[11px] font-medium uppercase tracking-wide text-ink-700">
          {SERVICE_CATEGORY_LABELS[service.category]}
        </span>
      </div>
      <div className="flex flex-1 flex-col gap-2 p-5">
        <h3 className="font-display text-lg text-ink-900">{service.name}</h3>
        <p className="line-clamp-2 text-sm text-ink-500">{service.description}</p>
        <div className="mt-auto flex items-center justify-between pt-3 text-sm">
          <span className="flex items-center gap-1 text-ink-500">
            <Clock className="h-4 w-4" /> {formatDuration(service.duration)}
          </span>
          <span className="font-semibold text-gold-600">{formatFCFA(service.price)}</span>
        </div>
      </div>
    </Link>
  );
}
