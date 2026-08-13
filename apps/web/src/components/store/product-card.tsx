import Image from "next/image";
import Link from "next/link";
import { discountPercent, formatToman, type Product } from "@/lib/catalog";
import { messages } from "@/lib/i18n";

export function ProductCard({ product }: { product: Product }) {
  const percent = discountPercent(product);

  return (
    <article className="h-full overflow-hidden rounded-xl bg-surface shadow-card motion-safe:transition motion-safe:hover:-translate-y-0.5 motion-safe:hover:shadow-lg">
      <Link href={product.href} className="flex h-full flex-col">
        <div className="relative aspect-[4/5] overflow-hidden bg-soft">
          <Image
            src={product.image}
            alt={product.title}
            fill
            sizes="(max-width: 768px) 50vw, (max-width: 1280px) 25vw, 20vw"
            className="object-cover"
          />
          {percent ? (
            <span className="absolute top-3 left-3 rounded-full bg-sale px-2 py-1 text-[11px] font-medium text-white">
              {percent.toLocaleString("fa-IR")}٪
            </span>
          ) : null}
          {!product.inStock ? (
            <span className="absolute inset-x-3 bottom-3 rounded-lg bg-espresso/80 px-2 py-1 text-center text-xs text-white">
              {messages.shop.outOfStock}
            </span>
          ) : null}
        </div>
        <div className="flex flex-1 flex-col p-3">
          <h3 className="line-clamp-2 min-h-12 text-sm leading-6">
            {product.title}
          </h3>
          <div className="mt-auto pt-3">
            {product.compareAt ? (
              <p className="text-xs text-muted line-through">
                {formatToman(product.compareAt)}
              </p>
            ) : (
              <p className="h-4" />
            )}
            <p className="mt-1 flex items-baseline gap-2 text-sm font-medium">
              {formatToman(product.price)}
              {percent ? (
                <span className="text-xs font-medium text-sale">
                  {percent.toLocaleString("fa-IR")}٪
                </span>
              ) : null}
            </p>
            <p
              className={`mt-2 text-xs ${
                product.inStock ? "text-shop" : "text-muted"
              }`}
            >
              {product.inStock ? messages.shop.inStock : messages.shop.outOfStock}
            </p>
          </div>
        </div>
      </Link>
    </article>
  );
}
