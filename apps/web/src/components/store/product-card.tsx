import Link from "next/link";
import { formatToman, type Product } from "@/lib/catalog";

export function ProductCard({ product }: { product: Product }) {
  return (
    <Link
      href={product.href}
      className="group flex h-full flex-col overflow-hidden rounded-xl border border-line/60 bg-white transition hover:shadow-[0_8px_24px_rgba(26,20,18,0.08)]"
    >
      <div
        className="relative aspect-square"
        style={{ background: product.tone }}
      >
        {product.badge ? (
          <span className="absolute top-2 right-2 rounded-md bg-sale px-2 py-0.5 text-xs text-white">
            {product.badge}
          </span>
        ) : null}
      </div>
      <div className="flex flex-1 flex-col p-3">
        <h3 className="line-clamp-2 min-h-10 text-sm leading-6 text-ink">
          {product.title}
        </h3>
        {product.sold ? (
          <p className="mt-1 text-xs text-sale">{product.sold}</p>
        ) : (
          <p className="mt-1 text-xs text-muted/70">موجود در انبار</p>
        )}
        <div className="mt-auto pt-3">
          {product.compareAt ? (
            <p className="text-xs text-muted line-through">
              {formatToman(product.compareAt)}
            </p>
          ) : null}
          <p className="text-sm font-medium text-espresso">
            {formatToman(product.price)}
          </p>
        </div>
      </div>
    </Link>
  );
}
