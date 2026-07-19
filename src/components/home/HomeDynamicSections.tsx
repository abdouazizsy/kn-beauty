"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { listServices } from "@/lib/data/services";
import { listProducts } from "@/lib/data/products";
import { listGalleryItems } from "@/lib/data/gallery";
import { ServiceCard } from "@/components/shared/ServiceCard";
import { ProductCard } from "@/components/shared/ProductCard";
import { CategoryArt } from "@/components/ui/CategoryArt";
import { SectionHeading, Container } from "@/components/ui/Container";
import { LinkButton } from "@/components/ui/Button";
import type { Service, ServiceCategory } from "@/types/service";
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

const UNIVERSES: { serviceCategory: ServiceCategory | null; title: string; href: string }[] = [
  { serviceCategory: "maquillage", title: "Maquillage", href: "/services?category=maquillage" },
  { serviceCategory: "coiffure", title: "Coiffure", href: "/services?category=coiffure" },
  { serviceCategory: "onglerie", title: "Onglerie", href: "/services?category=onglerie" },
  { serviceCategory: null, title: "Boutique", href: "/boutique" },
];

function LinkUniverse({
  title,
  href,
  imageUrl,
  artCategory,
}: {
  title: string;
  href: string;
  imageUrl?: string;
  artCategory: ServiceCategory | "pyjamas";
}) {
  return (
    <Link href={href} className="group relative aspect-square overflow-hidden rounded-2xl">
      {imageUrl ? (
        <Image
          src={imageUrl}
          alt={title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-110"
        />
      ) : (
        <CategoryArt category={artCategory} className="transition-transform duration-500 group-hover:scale-110" />
      )}
      <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink-900/70 to-transparent p-4 font-display text-lg text-white">
        {title}
      </span>
    </Link>
  );
}

export function HomeDynamicSections() {
  const [allServices, setAllServices] = useState<Service[] | null>(null);
  const [allProducts, setAllProducts] = useState<Product[] | null>(null);
  const [gallery, setGallery] = useState<GalleryItem[] | null>(null);

  useEffect(() => {
    listServices().then((all) => setAllServices(all.filter((s) => s.active)));
    listProducts().then((all) => setAllProducts(all.filter((p) => p.active)));
    listGalleryItems().then((all) => setGallery(all.slice(0, 6)));
  }, []);

  const services = allServices?.slice(0, 3) ?? null;
  const products = allProducts?.slice(0, 4) ?? null;

  return (
    <>
      <section className="py-16">
        <Container>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {UNIVERSES.map((u) => (
              <LinkUniverse
                key={u.title}
                title={u.title}
                href={u.href}
                artCategory={u.serviceCategory ?? "pyjamas"}
                imageUrl={
                  u.serviceCategory
                    ? allServices?.find((s) => s.category === u.serviceCategory)?.imageUrl
                    : allProducts?.find((p) => p.images[0])?.images[0]
                }
              />
            ))}
          </div>
        </Container>
      </section>

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
