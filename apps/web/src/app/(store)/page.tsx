import Link from "next/link";
import { OfferCountdown } from "@/components/store/offer-countdown";
import { ProductCard } from "@/components/store/product-card";
import { FaIcon } from "@/components/fa-icon";
import { amazingOffers, categories, products } from "@/lib/catalog";
import { messages } from "@/lib/i18n";

export default function Home() {
  return (
    <main className="mx-auto max-w-7xl space-y-6 px-4 py-4">
      <section className="grid gap-3 lg:grid-cols-[1.7fr_1fr]">
        <Link
          href="/products"
          className="flex min-h-56 flex-col justify-end overflow-hidden rounded-2xl bg-espresso p-8 text-bone md:min-h-80"
        >
          <p className="text-sm text-bronze">{messages.home.eyebrow}</p>
          <h1 className="mt-2 max-w-md text-3xl font-medium leading-snug md:text-5xl">
            {messages.shop.heroTitle}
          </h1>
          <p className="mt-3 max-w-sm text-oat">{messages.shop.heroBody}</p>
          <span className="mt-6 inline-flex h-11 w-fit items-center rounded-xl bg-mocha px-5 text-sm">
            {messages.shop.heroCta}
          </span>
        </Link>
        <div className="grid gap-3">
          <Link
            href="/products?cat=women"
            className="flex min-h-36 items-end rounded-2xl bg-blush p-6 text-espresso"
          >
            <span className="text-xl font-medium">{messages.shop.bannerWomen}</span>
          </Link>
          <Link
            href="/products?cat=men"
            className="flex min-h-36 items-end rounded-2xl bg-sage p-6 text-white"
          >
            <span className="text-xl font-medium">{messages.shop.bannerMen}</span>
          </Link>
        </div>
      </section>

      <section className="rounded-2xl bg-white p-4">
        <div className="grid grid-cols-4 gap-3 sm:grid-cols-8">
          {categories.map((category) => (
            <Link
              key={category.href}
              href={category.href}
              className="flex flex-col items-center gap-2 py-2 text-xs text-muted hover:text-mocha"
            >
              <span className="flex size-14 items-center justify-center rounded-full bg-page text-mocha">
                <FaIcon icon={category.icon} />
              </span>
              {category.label}
            </Link>
          ))}
        </div>
      </section>

      <section className="overflow-hidden rounded-2xl bg-sale p-4 text-white">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <FaIcon icon="fa-bolt" />
            <h2 className="text-lg font-medium">{messages.shop.amazing}</h2>
            <OfferCountdown />
          </div>
          <Link href="/products?cat=sale" className="text-sm text-white/90">
            {messages.shop.amazingSeeAll}
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {amazingOffers.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      <section>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-medium">{messages.shop.popular}</h2>
          <Link href="/products" className="text-sm text-mocha">
            {messages.shop.amazingSeeAll}
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </main>
  );
}
