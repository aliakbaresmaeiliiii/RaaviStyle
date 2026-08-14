import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { FaIcon } from "@/components/fa-icon";
import { categories, products, type Product } from "@/lib/catalog";
import { messages } from "@/lib/i18n";

const featuredCategoryIds = ["bag", "mom", "cargo", "straight", "linen"] as const;

const stats = [
  {
    value: messages.about.statModelsValue,
    label: messages.about.statModels,
  },
  {
    value: messages.about.statSizesValue,
    label: messages.about.statSizes,
  },
  {
    value: messages.about.statOriginValue,
    label: messages.about.statOrigin,
  },
];

const pillars = [
  {
    index: "۰۱",
    icon: "fa-ruler",
    title: messages.about.pillarFitTitle,
    body: messages.about.pillarFitBody,
  },
  {
    index: "۰۲",
    icon: "fa-leaf",
    title: messages.about.pillarFabricTitle,
    body: messages.about.pillarFabricBody,
  },
  {
    index: "۰۳",
    icon: "fa-shirt",
    title: messages.about.pillarModelTitle,
    body: messages.about.pillarModelBody,
  },
];

const promises = [
  {
    icon: "fa-truck",
    title: messages.about.promiseShipTitle,
    body: messages.about.promiseShipBody,
  },
  {
    icon: "fa-rotate-left",
    title: messages.about.promiseReturnTitle,
    body: messages.about.promiseReturnBody,
  },
  {
    icon: "fa-shield-halved",
    title: messages.about.promiseAuthTitle,
    body: messages.about.promiseAuthBody,
  },
];

function productForCategory(id: string): Product | undefined {
  return products.find((product) => product.category === id);
}

const featuredModels = featuredCategoryIds
  .map((id) => {
    const category = categories.find((item) => item.id === id);
    const product = productForCategory(id);

    if (!category || !product) {
      return null;
    }

    return { category, product };
  })
  .filter((item): item is { category: (typeof categories)[number]; product: Product } =>
    Boolean(item),
  );

const storyImage = featuredModels[0]?.product.image ?? products[0]?.image;
const stackImages = [
  productForCategory("wide")?.image,
  productForCategory("skinny")?.image,
].filter((src): src is string => Boolean(src));

export function AboutView() {
  return (
    <main>
      <nav className="bg-soft" aria-label={messages.about.nav}>
        <ol className="mx-auto flex max-w-7xl flex-wrap items-center gap-2 px-4 py-3 text-xs text-cocoa sm:px-6">
          <li>
            <Link href="/" className="hover:text-ink">
              {messages.shop.breadcrumbHome}
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li className="text-ink">{messages.about.nav}</li>
        </ol>
      </nav>

      <section className="login-panel relative overflow-hidden text-bone">
        <div className="login-grain opacity-20" />
        <span className="login-orb -top-24 -left-16 h-72 w-72 bg-mocha/40" />
        <span className="login-orb -right-20 bottom-0 h-80 w-80 bg-bronze/20" />
        <span className="login-orb top-[45%] left-[38%] h-40 w-40 bg-sage/15" />

        <div className="relative mx-auto grid max-w-7xl items-end gap-12 px-6 py-16 sm:px-8 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:py-24">
          <div>
            <p className="text-sm font-light tracking-wide text-bronze">
              {messages.about.eyebrow}
            </p>
            <h1 className="mt-4 max-w-xl text-4xl font-light leading-snug sm:text-5xl lg:text-6xl">
              {messages.about.title}
            </h1>
            <p className="mt-6 max-w-lg text-base font-light leading-8 text-oat">
              {messages.about.lead}
            </p>
            <Link
              href="/products"
              className="mt-8 inline-flex h-12 items-center rounded-full bg-bone px-6 text-sm text-espresso transition hover:bg-oat"
            >
              {messages.about.heroCta}
            </Link>

            <ul className="mt-14 grid max-w-lg grid-cols-3 gap-6 border-t border-white/10 pt-8">
              {stats.map((stat) => (
                <li key={stat.label}>
                  <p className="text-2xl font-light text-bronze sm:text-3xl">
                    {stat.value}
                  </p>
                  <p className="mt-2 text-xs text-oat/70">{stat.label}</p>
                </li>
              ))}
            </ul>
          </div>

          <div className="relative mx-auto hidden h-[28rem] w-full max-w-md lg:block">
            {stackImages[0] ? (
              <figure className="absolute top-0 end-0 h-[78%] w-[68%] overflow-hidden rounded-[2rem] ring-1 ring-white/10">
                <Image
                  src={stackImages[0]}
                  alt=""
                  fill
                  sizes="280px"
                  className="object-cover"
                  priority
                />
              </figure>
            ) : null}
            {stackImages[1] ? (
              <figure className="absolute bottom-0 start-0 h-[72%] w-[62%] overflow-hidden rounded-[2rem] ring-1 ring-white/15">
                <Image
                  src={stackImages[1]}
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

      <section className="mx-auto grid max-w-7xl gap-12 px-6 py-16 sm:px-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:py-24">
        {storyImage ? (
          <figure className="relative aspect-[4/5] overflow-hidden rounded-[2rem] bg-soft shadow-card sm:aspect-[5/6]">
            <Image
              src={storyImage}
              alt=""
              fill
              sizes="(max-width: 1024px) 100vw, 42vw"
              className="object-cover"
            />
            <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-espresso/80 to-transparent px-6 pb-6 pt-16 text-sm text-bone">
              {messages.brand}
            </figcaption>
          </figure>
        ) : null}

        <div>
          <SectionKicker>{messages.about.storyKicker}</SectionKicker>
          <h2 className="mt-4 max-w-md text-3xl font-medium leading-snug sm:text-4xl">
            {messages.about.storyTitle}
          </h2>
          <p className="mt-6 max-w-xl text-sm leading-8 text-muted">
            {messages.about.storyBody}
          </p>
          <p className="mt-4 max-w-xl text-sm leading-8 text-muted">
            {messages.about.storyBody2}
          </p>
          <blockquote className="relative mt-10 max-w-md border-r-2 border-bronze pr-5 text-xl font-light leading-9 text-ink">
            {messages.about.storyQuote}
          </blockquote>
        </div>
      </section>

      <section className="bg-soft">
        <div className="mx-auto max-w-7xl px-6 py-16 sm:px-8 lg:py-20">
          <SectionKicker>{messages.about.craftKicker}</SectionKicker>
          <h2 className="mt-4 max-w-md text-3xl font-medium leading-snug">
            {messages.about.craftTitle}
          </h2>
          <ul className="mt-10 grid gap-4 md:grid-cols-3">
            {pillars.map((pillar) => (
              <li
                key={pillar.index}
                className="rounded-[1.75rem] bg-surface p-7 shadow-card"
              >
                <div className="flex items-start justify-between gap-4">
                  <span className="flex size-11 items-center justify-center rounded-full bg-espresso text-bronze">
                    <FaIcon icon={pillar.icon} />
                  </span>
                  <span className="text-2xl font-light text-bronze">
                    {pillar.index}
                  </span>
                </div>
                <h3 className="mt-8 text-lg font-medium">{pillar.title}</h3>
                <p className="mt-3 text-sm leading-7 text-muted">{pillar.body}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-16 sm:px-8 lg:py-20">
        <SectionKicker>{messages.about.modelsKicker}</SectionKicker>
        <h2 className="mt-4 max-w-md text-3xl font-medium leading-snug">
          {messages.about.modelsTitle}
        </h2>
        <p className="mt-4 max-w-lg text-sm leading-7 text-muted">
          {messages.about.modelsBody}
        </p>
        <ul className="mt-10 grid grid-cols-2 gap-3 md:grid-cols-4 md:grid-rows-2 md:gap-4">
          {featuredModels.map((item, index) => (
            <li
              key={item.category.id}
              className={index === 0 ? "col-span-2 row-span-2" : ""}
            >
              <Link
                href={item.category.href}
                className={`group relative block overflow-hidden rounded-[1.5rem] bg-soft ${
                  index === 0 ? "min-h-[22rem] md:h-full" : "aspect-[4/5]"
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
                <span className="absolute inset-0 bg-gradient-to-t from-espresso/75 via-espresso/10 to-transparent" />
                <span className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-3 p-4 text-bone sm:p-5">
                  <span>
                    <span className="block text-xs text-oat/80">
                      {messages.shop.breadcrumbPants}
                    </span>
                    <span className="mt-1 block text-lg font-medium">
                      {item.category.label}
                    </span>
                  </span>
                  <span className="flex size-9 items-center justify-center rounded-full border border-white/20 bg-white/10 text-sm">
                    <FaIcon icon="fa-arrow-left" />
                  </span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className="border-y border-line bg-surface">
        <div className="mx-auto max-w-7xl px-6 py-16 sm:px-8 lg:py-20">
          <SectionKicker>{messages.about.promiseKicker}</SectionKicker>
          <h2 className="mt-4 max-w-md text-3xl font-medium leading-snug">
            {messages.about.promiseTitle}
          </h2>
          <ul className="mt-10 grid gap-8 sm:grid-cols-3">
            {promises.map((item) => (
              <li key={item.title} className="flex gap-4">
                <span className="flex size-11 shrink-0 items-center justify-center rounded-full border border-line text-mocha">
                  <FaIcon icon={item.icon} />
                </span>
                <div>
                  <h3 className="text-sm font-medium">{item.title}</h3>
                  <p className="mt-2 text-sm leading-7 text-muted">{item.body}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-16 sm:px-8">
        <div className="relative overflow-hidden rounded-[2rem] bg-espresso px-6 py-12 text-bone sm:px-12 sm:py-16">
          <div className="login-grain opacity-15" />
          <span className="login-orb -left-10 -top-16 h-56 w-56 bg-mocha/35" />
          <span className="login-orb -bottom-16 -right-8 h-64 w-64 bg-bronze/20" />
          <div className="relative max-w-xl">
            <p className="text-sm font-light text-bronze">
              {messages.about.closeKicker}
            </p>
            <h2 className="mt-3 text-3xl font-light leading-snug sm:text-4xl">
              {messages.about.closeTitle}
            </h2>
            <p className="mt-4 text-sm leading-8 text-oat">
              {messages.about.closeBody}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/products"
                className="inline-flex h-12 items-center rounded-full bg-bone px-6 text-sm text-espresso"
              >
                {messages.about.closeShop}
              </Link>
              <a
                href={`mailto:${messages.shop.email}`}
                className="inline-flex h-12 items-center rounded-full border border-white/20 px-6 text-sm text-bone transition hover:border-bronze hover:text-bronze"
              >
                {messages.about.closeContact}
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

function SectionKicker({ children }: { children: ReactNode }) {
  return (
    <p className="flex items-center gap-3 text-sm text-mocha">
      <span className="block h-px w-8 bg-bronze" aria-hidden="true" />
      {children}
    </p>
  );
}
