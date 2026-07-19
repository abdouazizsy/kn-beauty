"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { listServices } from "@/lib/data/services";
import { listProducts } from "@/lib/data/products";
import { listGalleryItems } from "@/lib/data/gallery";
import { ServiceCard } from "@/components/shared/ServiceCard";
import { ProductCard } from "@/components/shared/ProductCard";
import { CategoryArt } from "@/components/ui/CategoryArt";
import { SectionHeading, Container } from "@/components/ui/Container";
import { LinkButton } from "@/components/ui/Button";
import type { Service } from "@/types/service";
import type { Product } from "@/types/product";
import type { GalleryItem } from "@/types/gallery";

function CardsSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="h-72 animate-pulse rounded-2xl bg-nude-100" />
      ))}
    </div>
  );
}

export function HomeDynamicSections() {
  const [services, setServices] = useState<Service[] | null>(null);
  const [products, setProducts] = useState<Product[] | null>(null);
  const [gallery, setGallery] = useState<GalleryItem[] | null>(null);

  useEffect(() => {
    listServices().then((all) => setServices(all.filter((s) => s.active).slice(0, 3)));
    listProducts().then((all) => setProducts(all.filter((p) => p.active).slice(0, 4)));
    listGalleryItems().then((all) => setGallery(all.slice(0, 6)));
  }, []);

  return (
    <>
      <section className="py-20">
        <Container>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <SectionHeading eyebrow="Nos prestations" title="Services les plus demandés" />
            <LinkButton href="/services" variant="outline" size="sm">Voir tous les services</LinkButton>
          </div>
          <div className="mt-10">
            {services ? (
              services.length > 0 ? (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {services.map((s) => (
                    <ServiceCard key={s.id} service={s} />
                  ))}
                </div>
              ) : (
                <p className="text-ink-500">Aucun service disponible pour le moment.</p>
              )
            ) : (
              <CardsSkeleton />
            )}
          </div>
        </Container>
      </section>

      <section className="bg-nude-50 py-20">
        <Container>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <SectionHeading eyebrow="Boutique" title="Nos coups de cœur" />
            <LinkButton href="/boutique" variant="outline" size="sm">Voir la boutique</LinkButton>
          </div>
          <div className="mt-10">
            {products ? (
              products.length > 0 ? (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                  {products.map((p) => (
                    <ProductCard key={p.id} product={p} />
                  ))}
                </div>
              ) : (
                <p className="text-ink-500">Aucun produit disponible pour le moment.</p>
              )
            ) : (
              <CardsSkeleton count={4} />
            )}
          </div>
        </Container>
      </section>

      <section className="py-20">
        <Container>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <SectionHeading eyebrow="Galerie" title="Nos plus belles réalisations" />
            <LinkButton href="/gallery" variant="outline" size="sm">Voir la galerie</LinkButton>
          </div>
          <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3">
            {(gallery ?? Array.from({ length: 6 })).map((item, i) => (
              <Link
                key={item && "id" in item ? item.id : i}
                href="/gallery"
                className="relative aspect-square overflow-hidden rounded-2xl"
              >
                {item && "imageUrl" in item ? (
                  item.imageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={item.imageUrl} alt={item.title} className="h-full w-full object-cover" />
                  ) : (
                    <CategoryArt category={item.category} label={item.title} />
                  )
                ) : (
                  <div className="h-full w-full animate-pulse bg-nude-100" />
                )}
              </Link>
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}
