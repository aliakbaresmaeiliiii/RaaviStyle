"use client";

import Link from "next/link";
import { useMemo, useState, useSyncExternalStore } from "react";
import { FaIcon } from "@/components/fa-icon";
import { useCart } from "@/components/store/cart-provider";
import { ProductCard } from "@/components/store/product-card";
import { ProductGallery } from "@/components/store/product-gallery";
import { ReviewFormDialog, StarRating } from "@/components/store/review-form";
import {
  SIZE_GUIDE_HASH,
  SizeGuideDialog,
} from "@/components/store/size-guide-dialog";
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
import { MAX_QTY } from "@/lib/cart";
import { messages } from "@/lib/i18n";
import {
  averageRating,
  getFeedbackSnapshot,
  questionsForProduct,
  reviewsForProduct,
  saveQuestion,
  subscribeFeedback,
} from "@/lib/reviews";
import { formatFaCalendar } from "@/lib/tracking";

type Tab = "desc" | "extra" | "reviews" | "questions";

const demoReviews = [
  { name: "نازنین", text: "سایز دقیق بود و روی تن خیلی راحت است.", rating: 5 },
  { name: "مریم", text: "پارچه خنک است؛ برای تابستان مناسب بود.", rating: 4 },
  { name: "سارا", text: "رنگ کمی تیره‌تر از عکس درآمد، ولی کیفیت خوب است.", rating: 4 },
  { name: "الهام", text: "ارسال سریع بود و بسته‌بندی مرتب.", rating: 5 },
  { name: "نیلوفر", text: "دوخت تمیز است و بعد از شستشو فرم را حفظ کرد.", rating: 5 },
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
  reviewerName = "",
}: {
  product: Product;
  similar: Product[];
  reviewerName?: string;
}) {
  const percent = discountPercent(product);
  const images = useMemo(() => productImages(product), [product]);
  const { addItem } = useCart();
  const [tab, setTab] = useState<Tab>("desc");
  const [color, setColor] = useState(product.colors[0]);
  const [size, setSize] = useState(product.sizes[0]);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const [priceHint, setPriceHint] = useState(false);
  const [reviewOpen, setReviewOpen] = useState(false);
  const [questionText, setQuestionText] = useState("");
  const [questionError, setQuestionError] = useState("");
  const feedbackRaw = useSyncExternalStore(
    subscribeFeedback,
    getFeedbackSnapshot,
    () => "",
  );
  const userReviews = useMemo(
    () => (feedbackRaw ? reviewsForProduct(product.id) : []),
    [feedbackRaw, product.id],
  );
  const userQuestions = useMemo(
    () => (feedbackRaw ? questionsForProduct(product.id) : []),
    [feedbackRaw, product.id],
  );
  const reviewCount = userReviews.length + demoReviews.length;
  const ratingValue = averageRating([...userReviews, ...demoReviews]);

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
    addItem({ productId: product.id, color, size, quantity: qty });
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
    <main className="pb-32 lg:pb-10">
      <nav className="bg-soft">
        <ol className="mx-auto flex max-w-[1400px] flex-wrap items-center gap-2 px-4 py-3 text-xs text-cocoa">
          <li>
            <Link href="/" className="hover:text-ink">
              {messages.shop.breadcrumbHome}
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li>
            <Link href="/products" className="hover:text-ink">
              {messages.shop.breadcrumbPants}
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li>
            <Link
              href={`/products?cat=${product.category}`}
              className="hover:text-ink"
            >
              {categoryLabel(product.category)}
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li className="text-ink">{product.title}</li>
        </ol>
      </nav>

      <div className="mx-auto grid max-w-[1400px] items-start gap-6 px-4 py-6 lg:grid-cols-[minmax(0,1fr)_300px]">
        <div>
          <section className="grid items-start gap-8 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1fr)]">
            <ProductGallery
              productId={product.id}
              title={product.title}
              images={images}
              colorName={colorLabel(color)}
            />

            <div>
              <h1 className="text-[1.65rem] leading-10 font-medium">
                {product.title}
              </h1>
              <p className="mt-1 text-xs text-muted">
                {messages.shop.sku} {productSku(product)}
              </p>

              <div className="mt-3 flex flex-wrap items-center gap-2 text-sm">
                <span className="inline-flex items-center gap-1.5 text-muted">
                  <FaIcon icon="fa-star" className="text-bronze" />
                  {ratingValue
                    ? ratingValue.toLocaleString("fa-IR", {
                        maximumFractionDigits: 1,
                      })
                    : messages.shop.noRating}
                </span>
                <button
                  type="button"
                  onClick={() => openTab("reviews")}
                  className="rounded-full bg-surface px-3 py-1 text-xs ring-1 ring-line"
                >
                  {messages.shop.reviewLink}
                  {reviewCount
                    ? ` (${reviewCount.toLocaleString("fa-IR")})`
                    : ""}
                </button>
                <button
                  type="button"
                  onClick={() => openTab("questions")}
                  className="rounded-full bg-surface px-3 py-1 text-xs ring-1 ring-line"
                >
                  {messages.shop.questionLink}
                </button>
              </div>

              <div className="mt-7">
                <p className="mb-3 flex items-center gap-2 text-sm">
                  <FaIcon icon="fa-palette" className="text-muted" />
                  {messages.shop.chooseColor}: {colorLabel(color)}
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
                            ? "inline-flex items-center gap-2 rounded-full bg-surface py-1 pr-3 pl-1 ring-1 ring-line"
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
                <div className="mb-3 flex items-center justify-between gap-3">
                  <p className="flex items-center gap-2 text-sm">
                    <FaIcon icon="fa-ruler" className="text-muted" />
                    {messages.shop.chooseSize}: {size}
                  </p>
                  <a
                    href={`#${SIZE_GUIDE_HASH}`}
                    className="shrink-0 text-sm text-shop hover:underline"
                    onClick={(event) => {
                      event.preventDefault();
                      const next = `${window.location.pathname}${window.location.search}#${SIZE_GUIDE_HASH}`;
                      if (window.location.hash !== `#${SIZE_GUIDE_HASH}`) {
                        window.history.pushState(null, "", next);
                      }
                      window.dispatchEvent(new HashChangeEvent("hashchange"));
                    }}
                  >
                    {messages.shop.sizeGuide}
                  </a>
                </div>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((value) => {
                    const selected = size === value;
                    return (
                      <button
                        key={value}
                        type="button"
                        onClick={() => setSize(value)}
                        className={`inline-flex h-10 min-w-16 items-center justify-center gap-2 rounded-lg px-4 text-sm ${
                          selected
                            ? "bg-surface ring-1 ring-shop"
                            : "bg-surface ring-1 ring-line"
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
                    className="rounded-xl bg-soft px-3 py-3 text-center"
                  >
                    <p className="text-[11px] text-muted">{spec.label}</p>
                    <p className="mt-1 text-sm">{spec.value}</p>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => openTab("extra")}
                  className="rounded-xl bg-soft px-3 py-3 text-sm text-mocha"
                >
                  {messages.shop.viewAllSpecs}
                </button>
              </div>

              <article className="mt-8 rounded-2xl border border-line/80 bg-surface p-4">
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

          <section className="mt-8 grid gap-6 rounded-2xl bg-surface px-4 py-6 sm:grid-cols-2 lg:grid-cols-4">
            {perks.map((item) => (
              <div key={item.title} className="flex items-center gap-3">
                <span className="flex size-11 items-center justify-center text-xl text-ink">
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
                    `${messages.shop.tabReviews} (${reviewCount.toLocaleString("fa-IR")})`,
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
                      ? "bg-bronze text-espresso"
                      : "bg-surface text-ink ring-1 ring-line"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
            <div className="mt-3 rounded-2xl bg-soft p-5 text-sm leading-8 text-muted">
              {tab === "desc" ? <p>{messages.shop.colorNote}</p> : null}
              {tab === "extra" ? (
                <dl className="divide-y divide-line/70">
                  {extraRows.map(([label, value]) => (
                    <div
                      key={label}
                      className="grid grid-cols-2 gap-4 py-3 text-ink"
                    >
                      <dt className="text-muted">{label}</dt>
                      <dd>{value}</dd>
                    </div>
                  ))}
                </dl>
              ) : null}
              {tab === "reviews" ? (
                <div>
                  <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                    <p className="font-medium text-ink">
                      {messages.shop.userReviews}
                    </p>
                    <button
                      type="button"
                      onClick={() => setReviewOpen(true)}
                      className="inline-flex h-10 items-center rounded-lg border border-sale px-4 text-sm text-sale hover:bg-sale/5"
                    >
                      {messages.shop.writeReview}
                    </button>
                  </div>
                  <ul className="space-y-4">
                    {userReviews.map((item) => (
                      <li
                        key={item.id}
                        className="border-b border-line/60 pb-4 last:border-0"
                      >
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="font-medium text-ink">{item.name}</p>
                          {item.buyer ? (
                            <span className="text-[11px] text-success">
                              {messages.shop.buyerBadge}
                            </span>
                          ) : null}
                        </div>
                        <div className="mt-1">
                          <StarRating value={item.rating} size="text-xs" />
                        </div>
                        <p className="mt-1">{item.text}</p>
                        <p className="mt-1 text-xs">
                          {formatFaCalendar(item.createdAt)}
                        </p>
                      </li>
                    ))}
                    {demoReviews.map((item) => (
                      <li
                        key={item.name}
                        className="border-b border-line/60 pb-4 last:border-0"
                      >
                        <p className="font-medium text-ink">{item.name}</p>
                        <div className="mt-1">
                          <StarRating value={item.rating} size="text-xs" />
                        </div>
                        <p className="mt-1">{item.text}</p>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
              {tab === "questions" ? (
                <div>
                  {userQuestions.length ? (
                    <ul className="mb-5 space-y-4">
                      {userQuestions.map((item) => (
                        <li
                          key={item.id}
                          className="border-b border-line/60 pb-4 last:border-0"
                        >
                          <p className="font-medium text-ink">{item.name}</p>
                          <p className="mt-1">{item.text}</p>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p>{messages.shop.noQuestions}</p>
                  )}
                  <label className="mt-4 block">
                    <span className="sr-only">{messages.shop.askQuestion}</span>
                    <textarea
                      rows={3}
                      value={questionText}
                      onChange={(event) => {
                        setQuestionText(event.target.value);
                        setQuestionError("");
                      }}
                      placeholder={messages.shop.askQuestion}
                      className="mt-2 w-full rounded-xl bg-surface p-3 text-ink outline-none ring-1 ring-line"
                    />
                  </label>
                  {questionError ? (
                    <p className="mt-2 text-xs text-error">{questionError}</p>
                  ) : null}
                  <button
                    type="button"
                    onClick={() => {
                      if (questionText.trim().length < 8) {
                        setQuestionError(messages.pay.required);
                        return;
                      }
                      saveQuestion(
                        {
                          id: product.id,
                          title: product.title,
                          href: product.href,
                          image: product.image,
                        },
                        {
                          name: reviewerName || "کاربر",
                          text: questionText,
                        },
                      );
                      setQuestionText("");
                    }}
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
          <div className="rounded-2xl bg-soft p-5">
            <div className="flex items-start gap-3 border-b border-line/70 pb-4">
              <span className="flex size-9 items-center justify-center rounded-full bg-surface text-mocha">
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
                  <span className="rounded-md bg-bronze px-2 py-0.5 text-xs text-espresso">
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

            <div className="mb-4 inline-flex h-11 items-center rounded-xl bg-surface ring-1 ring-line">
              <button
                type="button"
                className="flex size-11 items-center justify-center"
                aria-label={messages.shop.decreaseQty}
                onClick={() => setQty((value) => Math.max(1, value - 1))}
              >
                <FaIcon icon="fa-minus" className="text-xs" />
              </button>
              <span className="w-8 text-center text-sm">
                {qty.toLocaleString("fa-IR")}
              </span>
              <button
                type="button"
                className="flex size-11 items-center justify-center disabled:opacity-40"
                aria-label={messages.shop.increaseQty}
                disabled={qty >= MAX_QTY}
                onClick={() => setQty((value) => Math.min(MAX_QTY, value + 1))}
              >
                <FaIcon icon="fa-plus" className="text-xs" />
              </button>
            </div>
            {added ? (
              <Link
                href="/cart"
                className="inline-flex h-12 w-full items-center justify-center rounded-xl bg-espresso text-sm text-white"
              >
                {messages.shop.addedViewCart}
              </Link>
            ) : (
              <button
                type="button"
                disabled={!product.inStock}
                onClick={addToCart}
                className="inline-flex h-12 w-full items-center justify-center rounded-xl bg-espresso text-sm text-white disabled:opacity-50"
              >
                {messages.shop.addToCartFull}
              </button>
            )}
          </div>

          <div className="mt-3 grid gap-2">
            <button
              type="button"
              onClick={() => setReviewOpen(true)}
              className="flex items-center gap-3 rounded-xl border border-line bg-surface p-3 text-right text-xs leading-6"
            >
              <FaIcon icon="fa-star" className="text-bronze" />
              {messages.shop.writeReview}
            </button>
            <button
              type="button"
              onClick={() => openTab("reviews")}
              className="flex items-center gap-3 rounded-xl border border-line bg-surface p-3 text-right text-xs leading-6"
            >
              <FaIcon icon="fa-comments" className="text-shop" />
              {messages.shop.userReviews}
            </button>
            <button
              type="button"
              onClick={() => setPriceHint(true)}
              className="flex items-center gap-3 rounded-xl border border-line bg-surface p-3 text-right text-xs leading-6"
            >
              <FaIcon icon="fa-lightbulb" className="text-bronze" />
              {priceHint
                ? messages.shop.betterPriceThanks
                : messages.shop.betterPrice}
            </button>
          </div>
        </aside>
      </div>

      <div className="fixed inset-x-0 bottom-[calc(4rem+env(safe-area-inset-bottom))] z-30 border-t border-line bg-surface/95 px-4 py-3 backdrop-blur lg:hidden">
        <div className="mx-auto flex max-w-lg items-center gap-3">
          <p className="min-w-0 flex-1 truncate text-sm font-medium">
            {formatToman(product.price)}
          </p>
          {added ? (
            <Link
              href="/cart"
              className="inline-flex h-12 min-w-40 items-center justify-center rounded-xl bg-espresso px-5 text-sm text-white"
            >
              {messages.shop.addedViewCart}
            </Link>
          ) : (
            <button
              type="button"
              disabled={!product.inStock}
              onClick={addToCart}
              className="inline-flex h-12 min-w-40 items-center justify-center rounded-xl bg-espresso px-5 text-sm text-white disabled:opacity-50"
            >
              {messages.shop.addToCartFull}
            </button>
          )}
        </div>
      </div>

      <SizeGuideDialog product={product} size={size} />
      <ReviewFormDialog
        product={{
          id: product.id,
          title: product.title,
          href: product.href,
          image: product.image,
        }}
        defaultName={reviewerName}
        open={reviewOpen}
        onClose={() => setReviewOpen(false)}
      />
    </main>
  );
}
