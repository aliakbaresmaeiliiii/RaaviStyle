import type { ReactNode } from "react";
import Link from "next/link";
import { FaIcon } from "@/components/fa-icon";
import { OfferCountdown } from "@/components/store/offer-countdown";
import { ProductCard } from "@/components/store/product-card";
import { categories, products, type Product } from "@/lib/catalog";
import { messages } from "@/lib/i18n";

export function StoreHome() {
  const amazing = products.filter((product) => product.compareAt).slice(0, 4);
  const popular = products.filter((product) => product.inStock).slice(0, 4);
  const newest = [...products].slice(-4).reverse();

  return (
    <main className="mx-auto max-w-[1400px] px-4 py-5">
      <section className="overflow-hidden rounded-3xl bg-espresso px-5 py-6 text-bone sm:px-8 sm:py-8">
        <p className="text-xs text-bronze">{messages.login.collection}</p>
        <h1 className="mt-2 max-w-lg text-2xl font-medium leading-9 sm:text-3xl">
          {messages.shop.heroTitle}
        </h1>
        <p className="mt-2 max-w-md text-sm leading-7 text-oat">
          {messages.shop.heroBody}
        </p>
        <Link
          href="/products"
          className="mt-5 inline-flex h-11 items-center rounded-full bg-bone px-5 text-sm text-espresso"
        >
          {messages.shop.heroCta}
        </Link>
      </section>

      <section className="mt-6" aria-label={messages.shop.browseModels}>
        <h2 className="mb-3 text-sm font-medium text-muted">
          {messages.shop.browseModels}
        </h2>
        <ul className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 pb-1">
          <li>
            <Link
              href="/products"
              className="inline-flex h-11 shrink-0 items-center gap-2 rounded-full bg-espresso px-4 text-sm text-white"
            >
              <FaIcon icon="fa-table-cells" />
              {messages.shop.allCategories}
            </Link>
          </li>
          {categories.map((category) => (
            <li key={category.id}>
              <Link
                href={category.href}
                className="inline-flex h-11 shrink-0 items-center gap-2 rounded-full bg-surface px-4 text-sm shadow-card ring-1 ring-line hover:ring-mocha"
              >
                <FaIcon icon={category.icon} className="text-mocha" />
                {category.label}
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <ProductSection
        title={messages.shop.amazing}
        href="/products?cat=sale"
        products={amazing}
        extra={<OfferCountdown />}
        accent
      />
      <ProductSection
        title={messages.shop.popular}
        href="/products"
        products={popular}
      />
      <ProductSection
        title={messages.shop.newest}
        href="/products"
        products={newest}
      />
    </main>
  );
}

function ProductSection({
  title,
  href,
  products: items,
  extra,
  accent = false,
}: {
  title: string;
  href: string;
  products: Product[];
  extra?: ReactNode;
  accent?: boolean;
}) {
  if (items.length === 0) {
    return null;
  }

  return (
    <section className="mt-8">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2
          className={`flex items-center gap-2 text-lg font-medium ${
            accent ? "text-sale" : ""
          }`}
        >
          {accent ? <FaIcon icon="fa-bolt" /> : null}
          {title}
        </h2>
        <div className="flex items-center gap-3">
          {extra}
          <Link href={href} className="text-sm text-shop hover:underline">
            {messages.shop.amazingSeeAll}
          </Link>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4">
        {items.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
