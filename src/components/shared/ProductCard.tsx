import Image from "next/image";
import Link from "next/link";
import { CategoryArt } from "@/components/ui/CategoryArt";
import { formatFCFA } from "@/lib/format";
import { PRODUCT_CATEGORY_LABELS, type Product } from "@/types/product";

export function ProductCard({ product }: { product: Product }) {
  const outOfStock = product.stock <= 0;
  return (
    <Link
      href={`/product/${product.id}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-nude-200/70 bg-white transition-shadow hover:shadow-lg hover:shadow-nude-300/30"
    >
      <div className="relative aspect-square w-full overflow-hidden">
        {product.images[0] ? (
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <CategoryArt category={product.category} className="transition-transform duration-500 group-hover:scale-105" />
        )}
        <span className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-[11px] font-medium uppercase tracking-wide text-ink-700">
          {PRODUCT_CATEGORY_LABELS[product.category]}
        </span>
        {outOfStock && (
          <span className="absolute inset-0 flex items-center justify-center bg-ink-900/40 text-sm font-medium text-white">
            Rupture de stock
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-1 p-5">
        <h3 className="font-display text-base text-ink-900">{product.name}</h3>
        <p className="line-clamp-2 text-sm text-ink-500">{product.description}</p>
        <span className="mt-2 font-semibold text-gold-600">{formatFCFA(product.price)}</span>
      </div>
    </Link>
  );
}
