"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { FaIcon } from "@/components/fa-icon";
import { ProductCard } from "@/components/store/product-card";
import { ProductGallery } from "@/components/store/product-gallery";
import {
  categoryLabel,
  colorLabel,
  discountPercent,
  fabricLabel,
  formatToman,
  isLightColor,
  productImages,
  productLength,
  productSku,
  type Product,
} from "@/lib/catalog";
import { messages } from "@/lib/i18n";

type Tab = "desc" | "extra" | "reviews" | "questions";

const reviews = [
  { name: "نازنین", text: "سایز دقیق بود و روی تن خیلی راحت است." },
  { name: "مریم", text: "پارچه خنک است؛ برای تابستان مناسب بود." },
  { name: "سارا", text: "رنگ کمی تیره‌تر از عکس درآمد، ولی کیفیت خوب است." },
  { name: "الهام", text: "ارسال سریع بود و بسته‌بندی مرتب." },
  { name: "نیلوفر", text: "دوخت تمیز است و بعد از شستشو فرم را حفظ کرد." },
];

const perks = [
  { icon: "fa-truck-fast", title: messages.shop.perkShip, body: messages.shop.perkShipSub },
  { icon: "fa-money-bill-wave", title: messages.shop.perkPay, body: messages.shop.perkPaySub },
  { icon: "fa-rotate-left", title: messages.shop.perkReturn, body: messages.shop.perkReturnSub },
  { icon: "fa-box", title: messages.shop.perkAuth, body: messages.shop.perkAuthSub },
];

export function ProductDetail({
  product,
  similar,
}: {
  product: Product;
  similar: Product[];
}) {
  const percent = discountPercent(product);
  const images = useMemo(() => productImages(product), [product]);
  const [tab, setTab] = useState<Tab>("desc");
  const [color, setColor] = useState(product.colors[0]);
  const [size, setSize] = useState(product.sizes[0]);
  const [added, setAdded] = useState(false);
  const [priceHint, setPriceHint] = useState(false);

  const specs = [
    { label: messages.shop.specPattern, value: messages.shop.specPatternValue },
    { label: messages.shop.specFit, value: messages.shop.specFitValue },
    { label: messages.shop.specGender, value: messages.shop.specGenderValue },
    { label: messages.shop.extraFabric, value: fabricLabel(product) },
    { label: messages.shop.specLength, value: productLength(product) },
  ];

  const extraRows = [
    [messages.shop.extraFabric, fabricLabel(product)],
    [messages.shop.extraModel, categoryLabel(product.category)],
    [messages.shop.extraColor, product.colors.map(colorLabel).join("، ")],
    [messages.shop.extraSize, product.sizes.join("، ")],
    [messages.shop.specLength, productLength(product)],
    [messages.shop.extraOrigin, messages.shop.extraOriginValue],
  ];

  function addToCart() {
    if (!product.inStock) {
      return;
    }
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1800);
  }

  function openTab(next: Tab) {
    setTab(next);
    document.getElementById("product-tabs")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }

  return (
    <main className="pb-10">
      <nav className="bg-[#e9d8c4]">
        <ol className="mx-auto flex max-w-[1400px] flex-wrap items-center gap-2 px-4 py-3 text-xs text-cocoa">
          <li>
            <Link href="/" className="hover:text-espresso">
              {messages.shop.breadcrumbHome}
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li>
            <Link href="/products" className="hover:text-espresso">
              {messages.shop.breadcrumbPants}
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li>
            <Link
              href={`/products?cat=${product.category}`}
              className="hover:text-espresso"
            >
              {categoryLabel(product.category)}
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li className="text-espresso">{product.title}</li>
        </ol>
      </nav>

      <div className="mx-auto grid max-w-[1400px] items-start gap-6 px-4 py-6 lg:grid-cols-[minmax(0,1fr)_300px]">
        <div>
          <section className="grid items-start gap-8 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1fr)]">
            <ProductGallery
              title={product.title}
              images={images}
              colorName={colorLabel(color)}
            />

            <div>
              <h1 className="text-[1.65rem] leading-10 font-medium">
                {product.title} {productSku(product)}
              </h1>

              <div className="mt-3 flex flex-wrap items-center gap-2 text-sm">
                <span className="inline-flex items-center gap-1.5 text-muted">
                  <FaIcon icon="fa-star" className="text-bronze" />
                  {messages.shop.noRating}
                </span>
                <button
                  type="button"
                  onClick={() => openTab("reviews")}
                  className="rounded-full bg-white px-3 py-1 text-xs ring-1 ring-line"
                >
                  {messages.shop.reviewLink}
                </button>
                <button
                  type="button"
                  onClick={() => openTab("questions")}
                  className="rounded-full bg-white px-3 py-1 text-xs ring-1 ring-line"
                >
                  {messages.shop.questionLink}
                </button>
              </div>

              <div className="mt-7">
                <p className="mb-3 flex items-center gap-2 text-sm">
                  <FaIcon icon="fa-palette" className="text-muted" />
                  {messages.shop.chooseColor}
                </p>
                <div className="flex flex-wrap items-end gap-3">
                  {product.colors.map((value) => {
                    const selected = color === value;
                    return (
                      <button
                        key={value}
                        type="button"
                        onClick={() => setColor(value)}
                        className={
                          selected
                            ? "inline-flex items-center gap-2 rounded-full bg-white py-1 pr-3 pl-1 ring-1 ring-line"
                            : "flex flex-col items-center gap-1.5"
                        }
                      >
                        <span
                          className="flex size-8 items-center justify-center rounded-full ring-1 ring-black/10"
                          style={{ background: value }}
                        >
                          {selected ? (
                            <FaIcon
                              icon="fa-check"
                              className={`text-xs ${
                                isLightColor(value) ? "text-espresso" : "text-white"
                              }`}
                            />
                          ) : null}
                        </span>
                        <span className={selected ? "text-sm" : "text-[11px] text-muted"}>
                          {colorLabel(value)}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="mt-7">
                <p className="mb-3 flex items-center gap-2 text-sm">
                  <FaIcon icon="fa-ruler" className="text-muted" />
                  {messages.shop.chooseSize}
                </p>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((value) => {
                    const selected = size === value;
                    return (
                      <button
                        key={value}
                        type="button"
                        onClick={() => setSize(value)}
                        className={`inline-flex h-10 min-w-16 items-center justify-center gap-2 rounded-full px-4 text-sm ${
                          selected
                            ? "bg-white ring-1 ring-espresso"
                            : "bg-white ring-1 ring-line"
                        }`}
                      >
                        {selected ? (
                          <FaIcon icon="fa-check" className="text-xs text-shop" />
                        ) : null}
                        {value}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="mt-8 grid grid-cols-3 gap-2">
                {specs.map((spec) => (
                  <div
                    key={spec.label}
                    className="rounded-xl bg-[#f3f3f3] px-3 py-3 text-center"
                  >
                    <p className="text-[11px] text-muted">{spec.label}</p>
                    <p className="mt-1 text-sm">{spec.value}</p>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => openTab("extra")}
                  className="rounded-xl bg-[#f3f3f3] px-3 py-3 text-sm text-mocha"
                >
                  {messages.shop.viewAllSpecs}
                </button>
              </div>

              <article className="mt-8 rounded-2xl border border-line/80 bg-white p-4">
                <h2 className="flex items-center gap-2 text-sm font-medium">
                  <FaIcon icon="fa-gem" className="text-[#7c3aed]" />
                  {messages.shop.shippingTitle}
                </h2>
                <ul className="mt-3 list-disc space-y-1.5 pr-5 text-sm leading-7 text-muted">
                  <li>{messages.shop.shippingDays}</li>
                  <li>{messages.shop.shippingFree}</li>
                </ul>
              </article>
            </div>
          </section>

          <section className="mt-6 grid gap-3 md:grid-cols-2">
            <a
              href="https://tara.ir"
              target="_blank"
              rel="noreferrer"
              className="flex min-h-[4.5rem] items-center justify-between rounded-2xl bg-[#6d28d9] px-5 text-white"
            >
              <div>
                <p className="text-sm font-medium">{messages.shop.taraTitle}</p>
                <p className="mt-1 text-xs text-white/80">{messages.shop.taraBody}</p>
              </div>
              <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-white/15">
                <FaIcon icon="fa-arrow-left" />
              </span>
            </a>
            <a
              href="https://snapppay.ir"
              target="_blank"
              rel="noreferrer"
              className="flex min-h-[4.5rem] items-center justify-between rounded-2xl bg-[#2f6fed] px-5 text-white"
            >
              <div>
                <p className="text-sm font-medium">{messages.shop.snappTitle}</p>
                <p className="mt-1 text-xs text-white/80">{messages.shop.snappBody}</p>
              </div>
              <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-white/15">
                <FaIcon icon="fa-arrow-left" />
              </span>
            </a>
          </section>

          <section className="mt-8 grid gap-6 rounded-2xl bg-white px-4 py-6 sm:grid-cols-2 lg:grid-cols-4">
            {perks.map((item) => (
              <div key={item.title} className="flex items-center gap-3">
                <span className="flex size-11 items-center justify-center text-xl text-espresso">
                  <FaIcon icon={item.icon} />
                </span>
                <div>
                  <p className="text-sm font-medium">{item.title}</p>
                  <p className="text-xs text-muted">{item.body}</p>
                </div>
              </div>
            ))}
          </section>

          <section id="product-tabs" className="mt-8 scroll-mt-24">
            <div className="flex flex-wrap gap-2">
              {(
                [
                  ["desc", messages.shop.tabDesc],
                  ["extra", messages.shop.tabExtra],
                  [
                    "reviews",
                    `${messages.shop.tabReviews} (${reviews.length.toLocaleString("fa-IR")})`,
                  ],
                  ["questions", messages.shop.tabQuestions],
                ] as Array<[Tab, string]>
              ).map(([id, label]) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setTab(id)}
                  className={`rounded-xl px-5 py-2.5 text-sm ${
                    tab === id
                      ? "bg-[#c5a27d] text-white"
                      : "bg-white text-espresso ring-1 ring-line"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
            <div className="mt-3 rounded-2xl bg-[#f3f3f3] p-5 text-sm leading-8 text-muted">
              {tab === "desc" ? <p>{messages.shop.colorNote}</p> : null}
              {tab === "extra" ? (
                <dl className="divide-y divide-line/70">
                  {extraRows.map(([label, value]) => (
                    <div
                      key={label}
                      className="grid grid-cols-2 gap-4 py-3 text-espresso"
                    >
                      <dt className="text-muted">{label}</dt>
                      <dd>{value}</dd>
                    </div>
                  ))}
                </dl>
              ) : null}
              {tab === "reviews" ? (
                <ul className="space-y-4">
                  {reviews.map((item) => (
                    <li
                      key={item.name}
                      className="border-b border-line/60 pb-4 last:border-0"
                    >
                      <p className="font-medium text-espresso">{item.name}</p>
                      <p className="mt-1">{item.text}</p>
                    </li>
                  ))}
                </ul>
              ) : null}
              {tab === "questions" ? (
                <div>
                  <p>{messages.shop.noQuestions}</p>
                  <label className="mt-4 block">
                    <span className="sr-only">{messages.shop.askQuestion}</span>
                    <textarea
                      rows={3}
                      placeholder={messages.shop.askQuestion}
                      className="mt-2 w-full rounded-xl bg-white p-3 text-espresso outline-none ring-1 ring-line"
                    />
                  </label>
                  <button
                    type="button"
                    className="mt-3 inline-flex h-10 items-center rounded-lg bg-espresso px-4 text-white"
                  >
                    {messages.shop.sendQuestion}
                  </button>
                </div>
              ) : null}
            </div>
          </section>

          <section className="mt-12">
            <h2 className="mb-5 text-xl font-medium">{messages.shop.similar}</h2>
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
              {similar.map((item) => (
                <ProductCard key={item.id} product={item} />
              ))}
            </div>
          </section>
        </div>

        <aside className="lg:sticky lg:top-24">
          <div className="rounded-2xl bg-[#f4f1ec] p-5">
            <div className="flex items-start gap-3 border-b border-line/70 pb-4">
              <span className="flex size-9 items-center justify-center rounded-full bg-white text-mocha">
                <FaIcon icon="fa-shield-halved" />
              </span>
              <div>
                <p className="text-sm font-medium">{messages.shop.warranty}</p>
                <p className="mt-1 text-xs leading-6 text-muted">
                  {messages.shop.warrantyBody}
                </p>
              </div>
            </div>

            <div className="py-5">
              {percent ? (
                <div className="mb-2 flex items-center gap-2">
                  <span className="rounded-md bg-[#c5a27d] px-2 py-0.5 text-xs text-white">
                    {percent.toLocaleString("fa-IR")}٪
                  </span>
                  {product.compareAt ? (
                    <span className="text-sm text-muted line-through">
                      {product.compareAt.toLocaleString("fa-IR")}
                    </span>
                  ) : null}
                </div>
              ) : product.compareAt ? (
                <p className="mb-2 text-sm text-muted line-through">
                  {product.compareAt.toLocaleString("fa-IR")}
                </p>
              ) : null}
              <p className="text-2xl font-medium">{formatToman(product.price)}</p>
              <p
                className={`mt-2 text-xs ${
                  product.inStock ? "text-shop" : "text-muted"
                }`}
              >
                {product.inStock ? messages.shop.inStock : messages.shop.outOfStock}
              </p>
            </div>

            <button
              type="button"
              disabled={!product.inStock}
              onClick={addToCart}
              className="inline-flex h-12 w-full items-center justify-center rounded-xl bg-[#4a342c] text-sm text-white disabled:opacity-50"
            >
              {added ? messages.shop.addedToCart : messages.shop.addToCartFull}
            </button>
          </div>

          <div className="mt-3 grid gap-2">
            <button
              type="button"
              onClick={() => openTab("reviews")}
              className="flex items-center gap-3 rounded-xl border border-line bg-white p-3 text-right text-xs leading-6"
            >
              <FaIcon icon="fa-star" className="text-bronze" />
              {messages.shop.rateItem}
            </button>
            <button
              type="button"
              onClick={() => openTab("reviews")}
              className="flex items-center gap-3 rounded-xl border border-line bg-white p-3 text-right text-xs leading-6"
            >
              <FaIcon icon="fa-comments" className="text-shop" />
              {messages.shop.userReviews}
            </button>
            <button
              type="button"
              onClick={() => setPriceHint(true)}
              className="flex items-center gap-3 rounded-xl border border-line bg-white p-3 text-right text-xs leading-6"
            >
              <FaIcon icon="fa-lightbulb" className="text-bronze" />
              {priceHint
                ? messages.shop.betterPriceThanks
                : messages.shop.betterPrice}
            </button>
          </div>
        </aside>
      </div>
    </main>
  );
}
