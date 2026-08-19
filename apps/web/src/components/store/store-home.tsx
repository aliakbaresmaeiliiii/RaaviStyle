import Image from "next/image";
import Link from "next/link";
import { FaIcon } from "@/components/fa-icon";
import { OfferCountdown } from "@/components/store/offer-countdown";
import { ProductCard } from "@/components/store/product-card";
import { categories, type Product } from "@/lib/catalog";
import { messages } from "@/lib/i18n";
import type { SitePage } from "@/lib/medusa-cms";
import { HeroSlider } from "./hero-slider";

const featuredIds = ["bag", "mom", "cargo", "straight", "linen"] as const;

const trust = [
  {
    icon: "fa-truck",
    title: messages.shop.footerTrustShip,
    hint: messages.shop.footerTrustShipHint,
  },
  {
    icon: "fa-rotate-left",
    title: messages.shop.footerTrustReturn,
    hint: messages.shop.footerTrustReturnHint,
  },
  {
    icon: "fa-ruler",
    title: messages.shop.footerTrustFit,
    hint: messages.shop.footerTrustFitHint,
  },
  {
    icon: "fa-shield-halved",
    title: messages.shop.perkAuth,
    hint: messages.shop.perkAuthSub,
  },
];

const pays = [
  {
    icon: "fa-money-bill-wave",
    title: messages.pay.methodCod,
    body: messages.pay.methodCodBody,
  },
  {
    icon: "fa-credit-card",
    title: messages.pay.methodOnline,
    body: messages.pay.methodOnlineBody,
  },
  {
    icon: "fa-bolt",
    title: messages.pay.methodSnapp,
    body: messages.pay.methodSnappBody,
  },
  {
    icon: "fa-wallet",
    title: messages.pay.methodTara,
    body: messages.pay.methodTaraBody,
  },
];

function productForCategory(catalog: Product[], id: string) {
  return catalog.find((product) => product.category === id);
}

function uniqueImages(sources: Array<string | undefined | null>) {
  const seen = new Set<string>();
  return sources.filter((src): src is string => {
    if (!src || seen.has(src)) {
      return false;
    }
    seen.add(src);
    return true;
  });
}

export function StoreHome({
  products,
  cms,
  href = "/products?cat=sale",
}: {
  products: Product[];
  cms?: SitePage | null;
  href: string;
}) {
  function findByCategory(id: string) {
    return productForCategory(products, id);
  }

  const featuredModels = featuredIds
    .map((id) => {
      const category = categories.find((item) => item.id === id);
      const product = findByCategory(id);
      debugger;
      if (!category || !product) {
        return null;
      }

      return { category, product };
    })
    .filter(
      (
        item,
      ): item is { category: (typeof categories)[number]; product: Product } =>
        Boolean(item),
    );

  const modelTiles =
    featuredModels.length > 0
      ? featuredModels
      : products.slice(0, 5).map((product) => ({
          category: {
            id: product.id,
            label: product.title,
            href: product.href,
            icon: "fa-shirt",
          },
          product,
        }));

  const restCategories = categories.filter(
    (category) =>
      !featuredIds.includes(category.id as (typeof featuredIds)[number]),
  );

  const heroImages = uniqueImages([
    cms?.image_url,
    findByCategory("bag")?.image?.[0],
    findByCategory("cargo")?.image[0],
    products[0]?.image[0],
    products[1]?.image[0],
  ]).slice(0, 2);

  const linenImage = findByCategory("linen")?.image[0] ?? products[2]?.image[0];

  const cargoImage = findByCategory("cargo")?.image[0] ?? products[3]?.image[0];

  const amazing = products.filter((product) => product.compareAt).slice(0, 8);
  const popular = products.filter((product) => product.inStock).slice(0, 8);
  const newest = products.slice(0, 8);
  const title = cms?.title || messages.home.title;

  return (
    <main>
      <section className="relative overflow-hidden bg-[#edf2ec]">
        <div className="mx-auto grid max-w-7xl items-center gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[6fr_920px] lg:gap-12 lg:px-8">
          {/* LEFT: Slider */}
          <div className="order-2 min-w-0 lg:order-2">
            <HeroSlider products={products} title="پیشنهاد ویژه" />
          </div>

          {/* RIGHT: Text */}
          <div className="order-1 text-center lg:order-1 lg:text-right">
            <span className="mb-3 inline-block text-xs font-medium tracking-wide text-[#e72d32]">
              پیشنهاد ویژه
            </span>

            <h2 className="text-3xl font-bold leading-tight text-[#e72d32] sm:text-4xl">
              {title}
            </h2>

            <p className="mx-auto mt-3 max-w-[220px] text-sm leading-7 text-[#737873] lg:mx-0">
              بهترین محصولات با تخفیف‌های ویژه
            </p>

            <Link
              href={href}
              className="mt-5 inline-flex h-10 items-center rounded-full bg-[#e72d32] px-5 text-xs font-medium text-white transition hover:bg-[#d9242a] active:scale-95"
            >
              مشاهده همه تخفیف‌ها
              <span className="mr-2">←</span>
            </Link>
          </div>
        </div>
      </section>

      <ul className="mx-auto grid max-w-7xl border-y border-line/60 sm:grid-cols-2 lg:grid-cols-4 mt-5">
        {trust.map((item, index) => (
          <li
            key={item.title}
            className={`
        group relative flex gap-4 px-6 py-6
        transition-colors duration-300
        hover:bg-surface/60
        ${index !== 0 ? "border-t border-line/60 sm:border-l sm:border-t-0" : ""}
        ${index === 2 ? "lg:border-l" : ""}
      `}
          >
            <span
              className="
          flex size-10 shrink-0 items-center justify-center
          rounded-full
          bg-surface
          text-mocha
          ring-1 ring-line/70
          transition-all duration-300
          group-hover:bg-mocha
          group-hover:text-white
          group-hover:ring-mocha
        "
            >
              <FaIcon icon={item.icon} />
            </span>

            <div>
              <p className="text-sm font-semibold tracking-tight">
                {item.title}
              </p>

              <p className="mt-1 text-xs leading-5 text-muted">{item.hint}</p>
            </div>
          </li>
        ))}
      </ul>
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:py-16">
        <h2 className="mt-3 max-w-md text-3xl font-medium leading-snug">
          {messages.home.modelsTitle}
        </h2>
        <p className="mt-3 max-w-lg text-sm leading-7 text-muted">
          {messages.home.modelsBody}
        </p>
        <ul className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-4 md:grid-rows-2 md:gap-4">
          {modelTiles.map((item, index) => (
            <li
              key={item.category.id}
              className={index === 0 ? "col-span-2 row-span-2" : ""}
            >
              <Link
                href={item.category.href}
                className={`group relative block overflow-hidden rounded-[1.5rem] bg-soft ${
                  index === 0 ? "min-h-[20rem] md:h-full" : "aspect-[4/5]"
                }`}
              >
                <Image
                  src={item.product.image[0]}
                  alt={item.category.label}
                  fill
                  sizes={
                    index === 0
                      ? "(max-width: 768px) 100vw, 50vw"
                      : "(max-width: 768px) 50vw, 25vw"
                  }
                  className="object-cover motion-safe:transition motion-safe:duration-500 motion-safe:group-hover:scale-105"
                />
                <span className="absolute inset-0 bg-gradient-to-t from-espresso/80 via-espresso/10 to-transparent" />
                <span className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-3 p-4 ">
                  <span>
                    <span className="block text-xs text-white ">
                      {messages.shop.breadcrumbPants}
                    </span>
                    <span className="mt-1 block text-lg font-medium text-white">
                      {item.category.label}
                    </span>
                  </span>
                  <span className="flex size-9 items-center justify-center rounded-full border border-white/20 bg-white/10">
                    <FaIcon
                      icon="fa-arrow-left"
                      className="text-xs text-white"
                    />
                  </span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
        {restCategories.length > 0 ? (
          <ul className="mt-5 flex flex-wrap gap-2">
            {restCategories.map((category) => (
              <li key={category.id}>
                <Link
                  href={category.href}
                  className="inline-flex h-10 items-center gap-2 rounded-full bg-surface px-4 text-sm shadow-card ring-1 ring-line hover:ring-mocha"
                >
                  <FaIcon icon={category.icon} className="text-mocha" />
                  {category.label}
                </Link>
              </li>
            ))}
            <li>
              <Link
                href="/products"
                className="inline-flex h-10 items-center gap-2 rounded-full bg-espresso px-4 text-sm text-white"
              >
                {messages.shop.allCategories}
              </Link>
            </li>
          </ul>
        ) : null}
      </section>
      <section className="bg-soft py-12 lg:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-sm text-sale">{messages.home.saleKicker}</p>
              <h2 className="mt-1 flex items-center gap-2 text-2xl font-medium text-sale sm:text-3xl">
                <FaIcon icon="fa-bolt" />
                {messages.shop.amazing}
              </h2>
            </div>
            <div className="flex items-center gap-4">
              <OfferCountdown />
              <Link
                href="/products?cat=sale"
                className="text-sm text-shop hover:underline"
              >
                {messages.shop.amazingSeeAll}
              </Link>
            </div>
          </div>
          <ProductRail products={amazing} />
        </div>
      </section>
      <section className="mx-auto grid max-w-7xl gap-4 px-4 py-12 sm:px-6 md:grid-cols-2">
        <CampaignCard
          href="/products?cat=linen"
          image={linenImage}
          title={messages.home.campaignLinen}
          body={messages.home.campaignLinenBody}
        />
        <CampaignCard
          href="/products?cat=cargo"
          image={cargoImage}
          title={messages.home.campaignCargo}
          body={messages.home.campaignCargoBody}
        />
      </section>
      <section className="mx-auto max-w-7xl px-4 pb-4 sm:px-6">
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
      </section>
      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <div className="relative overflow-hidden rounded-[2rem] bg-[#183a68] px-6 py-12  sm:px-12">
          <div className=" opacity-15 text-white" />
          <span className="-left-10 -top-16 h-48 w-48 bg-mocha/35" />
          <span className="-bottom-16 -right-8 h-56 w-56 bg-bronze/20" />
          <div className="relative max-w-xl">
            <h2 className="mt-3 text-3xl font-light text-white  leading-snug sm:text-4xl">
              {messages.home.storyTitle}
            </h2>
            <p className="mt-4 text-sm leading-8 text-white">
              {messages.home.storyBody}
            </p>
            <Link
              href="/about"
              className="mt-8 inline-flex h-12 items-center rounded-full bg-bone px-6 text-sm text-espresso"
            >
              {messages.about.readMore}
            </Link>
          </div>
        </div>
      </section>
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <h2 className="text-lg font-medium">{messages.home.payTitle}</h2>
        <ul className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {pays.map((item) => (
            <li
              key={item.title}
              className="flex items-start gap-3 rounded-2xl bg-surface p-4 shadow-card"
            >
              <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-soft text-mocha">
                <FaIcon icon={item.icon} />
              </span>
              <div>
                <p className="text-sm font-medium">{item.title}</p>
                <p className="mt-1 text-xs leading-6 text-muted">{item.body}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}

function ProductSection({
  title,
  href,
  products: items,
}: {
  title: string;
  href: string;
  products: Product[];
}) {
  if (items.length === 0) {
    return null;
  }

  return (
    <section className="mt-10">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="text-2xl font-medium">{title}</h2>
        <Link href={href} className="text-sm text-shop hover:underline">
          {messages.shop.amazingSeeAll}
        </Link>
      </div>
      <ProductRail products={items} />
    </section>
  );
}

function ProductRail({ products: items }: { products: Product[] }) {
  return (
    <div className="no-scrollbar flex gap-3 overflow-x-auto pb-1 md:grid md:grid-cols-4 md:overflow-visible">
      {items.map((product) => (
        <div key={product.id} className="w-[44%] shrink-0 sm:w-[38%] md:w-auto">
          <ProductCard product={product} />
        </div>
      ))}
    </div>
  );
}

function CampaignCard({
  href,
  image,
  title,
  body,
}: {
  href: string;
  image?: string;
  title: string;
  body: string;
}) {
  return (
    <Link
      href={href}
      className="group relative min-h-64 overflow-hidden rounded-[1.75rem] bg-espresso "
    >
      {image ? (
        <Image
          src={image}
          alt=""
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover opacity-70 motion-safe:transition motion-safe:duration-500 motion-safe:group-hover:scale-105"
        />
      ) : null}
      <span className="absolute inset-0 bg-linear-to-t from-espresso via-espresso/30 to-transparent" />
      <span className="absolute inset-x-0 bottom-0 p-6">
        <span className="block text-2xl font-light">{title}</span>
        <span className="mt-2 block text-sm ">{body}</span>
      </span>
    </Link>
  );
}
