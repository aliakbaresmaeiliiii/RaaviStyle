import Image from "next/image";
import Link from "next/link";
import { discountPercent, formatToman, type Product } from "@/lib/catalog";
import { messages } from "@/lib/i18n";

export function ProductCard({ product }: { product: Product }) {
  const percent = discountPercent(product);

  return (
    <article className="flex h-full flex-col overflow-hidden rounded-xl bg-white shadow-[0_2px_10px_rgba(0,0,0,0.06)]">
      <Link href={product.href} className="relative block bg-[#f3f3f3]">
        <div className="relative aspect-[4/5]">
          <Image
            src={product.image}
            alt={product.title}
            fill
            sizes="(max-width: 768px) 50vw, 25vw"
            className="object-cover"
          />
        </div>
        {percent ? (
          <span className="absolute top-3 left-3 flex size-9 items-center justify-center rounded-full bg-espresso text-[11px] text-white">
            {percent.toLocaleString("fa-IR")}٪
          </span>
        ) : null}
        <div className="absolute top-14 left-3 flex flex-col gap-1.5">
          {product.colors.map((color) => (
            <span
              key={color}
              className="size-3 rounded-full border border-white shadow-sm"
              style={{ background: color }}
            />
          ))}
        </div>
      </Link>
      <div className="flex flex-1 flex-col p-3">
        <Link href={product.href} className="line-clamp-2 min-h-12 text-sm leading-6">
          {product.title}
        </Link>
        <div className="mt-3">
          {product.compareAt ? (
            <p className="text-xs text-muted line-through">
              {formatToman(product.compareAt)}
            </p>
          ) : (
            <p className="h-4" />
          )}
          <p className="mt-1 text-sm font-medium">{formatToman(product.price)}</p>
        </div>
        <p
          className={`mt-2 flex items-center gap-1.5 text-xs ${
            product.inStock ? "text-shop" : "text-muted"
          }`}
        >
          <span
            className={`size-1.5 rounded-full ${
              product.inStock ? "bg-shop" : "bg-muted"
            }`}
          />
          {product.inStock ? messages.shop.inStock : messages.shop.outOfStock}
        </p>
        <Link
          href={product.href}
          className="mt-4 inline-flex h-11 items-center justify-center rounded-lg bg-espresso text-sm text-white"
        >
          {messages.shop.selectOptions}
        </Link>
      </div>
    </article>
  );
}
