import Image from "next/image";
import Link from "next/link";
import { FaIcon } from "@/components/fa-icon";
import { OfferCountdown } from "@/components/store/offer-countdown";
import { ProductCard } from "@/components/store/product-card";
import { categories, products, type Product } from "@/lib/catalog";
import { messages } from "@/lib/i18n";

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

function productForCategory(id: string) {
  return products.find((product) => product.category === id);
}

const featuredModels = featuredIds
  .map((id) => {
    const category = categories.find((item) => item.id === id);
    const product = productForCategory(id);

    if (!category || !product) {
      return null;
    }

    return { category, product };
  })
  .filter(
    (item): item is { category: (typeof categories)[number]; product: Product } =>
      Boolean(item),
  );

const restCategories = categories.filter(
  (category) => !featuredIds.includes(category.id as (typeof featuredIds)[number]),
);

const heroImages = [
  productForCategory("bag")?.image,
  productForCategory("cargo")?.image,
].filter((src): src is string => Boolean(src));

const linenImage = productForCategory("linen")?.image;
const cargoImage = productForCategory("cargo")?.image;

export function StoreHome() {
  const amazing = products.filter((product) => product.compareAt).slice(0, 8);
  const popular = products.filter((product) => product.inStock).slice(0, 8);
  const newest = [...products].slice(-8).reverse();

  return (
    <main>
      <section className="login-panel relative overflow-hidden text-bone">
        <div className="login-grain opacity-20" />
        <span className="login-orb -top-24 -left-16 h-72 w-72 bg-mocha/40" />
        <span className="login-orb -right-20 bottom-0 h-80 w-80 bg-bronze/20" />

        <div className="relative mx-auto grid max-w-7xl items-end gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:py-20">
          <div>
            <p className="text-sm font-light tracking-wide text-bronze">
              {messages.home.eyebrow}
            </p>
            <h1 className="mt-4 max-w-xl text-4xl font-light leading-snug sm:text-5xl lg:text-6xl">
              {messages.home.title}
            </h1>
            <p className="mt-5 max-w-lg text-base font-light leading-8 text-oat">
              {messages.home.body}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/products"
                className="inline-flex h-12 items-center rounded-full bg-bone px-6 text-sm text-espresso"
              >
                {messages.home.shop}
              </Link>
              <Link
                href="/about"
                className="inline-flex h-12 items-center rounded-full border border-white/20 px-6 text-sm text-bone transition hover:border-bronze hover:text-bronze"
              >
                {messages.home.story}
              </Link>
            </div>
            <ul className="mt-12 grid max-w-lg grid-cols-3 gap-6 border-t border-white/10 pt-8">
              <li>
                <p className="text-2xl font-light text-bronze">
                  {messages.about.statModelsValue}
                </p>
                <p className="mt-2 text-xs text-oat/70">
                  {messages.about.statModels}
                </p>
              </li>
              <li>
                <p className="text-2xl font-light text-bronze">
                  {messages.about.statSizesValue}
                </p>
                <p className="mt-2 text-xs text-oat/70">
                  {messages.about.statSizes}
                </p>
              </li>
              <li>
                <p className="text-2xl font-light text-bronze">
                  {messages.about.statOriginValue}
                </p>
                <p className="mt-2 text-xs text-oat/70">
                  {messages.about.statOrigin}
                </p>
              </li>
            </ul>
          </div>

          <div className="relative mx-auto hidden h-[28rem] w-full max-w-md lg:block">
            {heroImages[0] ? (
              <figure className="absolute top-0 end-0 h-[78%] w-[68%] overflow-hidden rounded-[2rem] ring-1 ring-white/10">
                <Image
                  src={heroImages[0]}
                  alt=""
                  fill
                  priority
                  sizes="280px"
                  className="object-cover"
                />
              </figure>
            ) : null}
            {heroImages[1] ? (
              <figure className="absolute bottom-0 start-0 h-[72%] w-[62%] overflow-hidden rounded-[2rem] ring-1 ring-white/15">
                <Image
                  src={heroImages[1]}
                  alt=""
                  fill
                  sizes="260px"
                  className="object-cover"
                />
              </figure>
            ) : null}
          </div>
        </div>
      </section>

      <ul className="mx-auto grid max-w-7xl gap-px bg-line sm:grid-cols-2 lg:grid-cols-4">
        {trust.map((item) => (
          <li
            key={item.title}
            className="flex items-start gap-3 bg-page px-5 py-5"
          >
            <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-surface text-mocha shadow-card">
              <FaIcon icon={item.icon} />
            </span>
            <div>
              <p className="text-sm font-medium">{item.title}</p>
              <p className="mt-1 text-xs leading-6 text-muted">{item.hint}</p>
            </div>
          </li>
        ))}
      </ul>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:py-16">
        <p className="flex items-center gap-3 text-sm text-mocha">
          <span className="block h-px w-8 bg-bronze" aria-hidden="true" />
          {messages.shop.browseModels}
        </p>
        <h2 className="mt-3 max-w-md text-3xl font-medium leading-snug">
          {messages.home.modelsTitle}
        </h2>
        <p className="mt-3 max-w-lg text-sm leading-7 text-muted">
          {messages.home.modelsBody}
        </p>
        <ul className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-4 md:grid-rows-2 md:gap-4">
          {featuredModels.map((item, index) => (
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
                  src={item.product.image}
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
                <span className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-3 p-4 text-bone">
                  <span>
                    <span className="block text-xs text-oat/80">
                      {messages.shop.breadcrumbPants}
                    </span>
                    <span className="mt-1 block text-lg font-medium">
                      {item.category.label}
                    </span>
                  </span>
                  <span className="flex size-9 items-center justify-center rounded-full border border-white/20 bg-white/10">
                    <FaIcon icon="fa-arrow-left" className="text-xs" />
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
        <div className="relative overflow-hidden rounded-[2rem] bg-espresso px-6 py-12 text-bone sm:px-12">
          <div className="login-grain opacity-15" />
          <span className="login-orb -left-10 -top-16 h-48 w-48 bg-mocha/35" />
          <span className="login-orb -bottom-16 -right-8 h-56 w-56 bg-bronze/20" />
          <div className="relative max-w-xl">
            <p className="text-sm font-light text-bronze">
              {messages.about.eyebrow}
            </p>
            <h2 className="mt-3 text-3xl font-light leading-snug sm:text-4xl">
              {messages.home.storyTitle}
            </h2>
            <p className="mt-4 text-sm leading-8 text-oat">
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
        <div
          key={product.id}
          className="w-[44%] shrink-0 sm:w-[38%] md:w-auto"
        >
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
      className="group relative min-h-64 overflow-hidden rounded-[1.75rem] bg-espresso text-bone"
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
      <span className="absolute inset-0 bg-gradient-to-t from-espresso via-espresso/30 to-transparent" />
      <span className="absolute inset-x-0 bottom-0 p-6">
        <span className="block text-2xl font-light">{title}</span>
        <span className="mt-2 block text-sm text-oat">{body}</span>
      </span>
    </Link>
  );
}
