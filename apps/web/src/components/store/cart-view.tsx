"use client"

import Image from "next/image"
import Link from "next/link"
import { useMemo } from "react"
import { FaIcon } from "@/components/fa-icon"
import { ProductCard } from "@/components/store/product-card"
import { useCart } from "@/components/store/cart-provider"
import { useCatalog } from "@/components/store/catalog-provider"
import {
  colorLabel,
  discountPercent,
  formatToman,
} from "@/lib/catalog"
import {
  cartTotals,
  FREE_SHIPPING_MIN,
  lineKey,
  MAX_QTY,
  resolveCart,
} from "@/lib/cart"
import { messages } from "@/lib/i18n"

export function CartView() {
  const products = useCatalog()
  const { lines, count, ready, updateQuantity, removeItem } = useCart()
  const items = useMemo(() => resolveCart(lines, products), [lines, products])
  const totals = useMemo(() => cartTotals(items), [items])
  const suggested = useMemo(() => {
    const inCart = new Set(items.map((item) => item.product.id))
    return products.filter((product) => !inCart.has(product.id)).slice(0, 4)
  }, [items, products])
  const shippingProgress = Math.min(
    100,
    Math.round((totals.itemsPrice / FREE_SHIPPING_MIN) * 100),
  )

  if (!ready) {
    return (
      <main className="mx-auto max-w-7xl px-4 py-6">
        <h1 className="text-2xl font-medium">{messages.shop.cart}</h1>
        <p className="mt-6 text-sm text-muted">{messages.shop.loading}</p>
      </main>
    )
  }

  return (
    <main className="mx-auto max-w-7xl px-4 py-6 pb-28 lg:pb-6">
      <nav className="mb-5 text-xs text-cocoa">
        <Link href="/" className="hover:text-ink">
          {messages.shop.breadcrumbHome}
        </Link>
        <span className="px-2" aria-hidden="true">
          /
        </span>
        <span className="text-ink">{messages.shop.cart}</span>
      </nav>

      <h1 className="text-2xl font-medium">
        {messages.shop.cart}
        {count > 0 ? (
          <span className="mr-2 text-base font-normal text-muted">
            {messages.shop.cartItemCount(count)}
          </span>
        ) : null}
      </h1>

      {items.length === 0 ? (
        <EmptyCart />
      ) : (
        <div className="mt-6 grid items-start gap-4 lg:grid-cols-[minmax(0,1fr)_320px]">
          <section className="space-y-3">
            {items.map((item) => {
              const key = lineKey(item)
              const percent = discountPercent(item.product)
              const linePrice = item.product.price * item.quantity
              const lineCompare = item.product.compareAt
                ? item.product.compareAt * item.quantity
                : null

              return (
                <article
                  key={key}
                  className="rounded-2xl bg-surface p-4 shadow-card"
                >
                  <div className="flex gap-4">
                    <Link
                      href={item.product.href}
                      className="relative size-28 shrink-0 overflow-hidden rounded-xl bg-soft sm:h-36 sm:w-28"
                    >
                      <Image
                        src={item.product.image[0]}
                        alt={item.product.title}
                        fill
                        sizes="112px"
                        className="object-cover"
                      />
                    </Link>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-3">
                        <Link
                          href={item.product.href}
                          className="text-sm leading-7 hover:text-mocha"
                        >
                          {item.product.title}
                        </Link>
                        <button
                          type="button"
                          onClick={() => removeItem(key)}
                          className="inline-flex size-9 shrink-0 items-center justify-center rounded-lg text-muted hover:bg-soft hover:text-sale"
                          aria-label={messages.shop.removeItem}
                        >
                          <FaIcon icon="fa-trash-can" />
                        </button>
                      </div>

                      <dl className="mt-2 space-y-1.5 text-xs text-muted">
                        <div className="flex items-center gap-2">
                          <span
                            className="size-3.5 rounded-full ring-1 ring-black/10"
                            style={{ background: item.color }}
                          />
                          <dt className="sr-only">{messages.shop.chooseColor}</dt>
                          <dd>{colorLabel(item.color)}</dd>
                          <span aria-hidden="true">|</span>
                          <dt>{messages.shop.chooseSize}</dt>
                          <dd>{item.size}</dd>
                        </div>
                        <div className="flex items-center gap-2">
                          <FaIcon icon="fa-store" />
                          <dt>{messages.shop.seller}</dt>
                          <dd>{messages.shop.sellerName}</dd>
                        </div>
                        <div className="flex items-center gap-2">
                          <FaIcon icon="fa-shield-halved" />
                          <dd>{messages.shop.warrantyBody}</dd>
                        </div>
                      </dl>

                      <div className="mt-4 flex flex-wrap items-end justify-between gap-3">
                        <div className="inline-flex h-10 items-center rounded-xl bg-page ring-1 ring-line">
                          <button
                            type="button"
                            onClick={() =>
                              updateQuantity(key, item.quantity - 1)
                            }
                            className="flex size-10 items-center justify-center text-muted hover:text-ink"
                            aria-label={
                              item.quantity === 1
                                ? messages.shop.removeItem
                                : messages.shop.decreaseQty
                            }
                          >
                            <FaIcon
                              icon={item.quantity === 1 ? "fa-trash-can" : "fa-minus"}
                              className="text-xs"
                            />
                          </button>
                          <span className="min-w-8 text-center text-sm">
                            {item.quantity.toLocaleString("fa-IR")}
                          </span>
                          <button
                            type="button"
                            disabled={item.quantity >= MAX_QTY}
                            onClick={() =>
                              updateQuantity(key, item.quantity + 1)
                            }
                            className="flex size-10 items-center justify-center text-muted hover:text-ink disabled:opacity-40"
                            aria-label={messages.shop.increaseQty}
                          >
                            <FaIcon icon="fa-plus" className="text-xs" />
                          </button>
                        </div>

                        <div className="text-left">
                          {percent && lineCompare ? (
                            <div className="mb-1 flex items-center justify-end gap-2">
                              <span className="rounded-md bg-bronze px-1.5 py-0.5 text-[11px] text-espresso">
                                {percent.toLocaleString("fa-IR")}٪
                              </span>
                              <span className="text-xs text-muted line-through">
                                {lineCompare.toLocaleString("fa-IR")}
                              </span>
                            </div>
                          ) : null}
                          <p className="text-base font-medium">
                            {formatToman(linePrice)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </article>
              )
            })}
          </section>

          <aside className="lg:sticky lg:top-24">
            <div className="rounded-2xl bg-surface p-5 shadow-card">
              <div className="rounded-xl bg-soft px-3 py-3">
                <p className="flex items-center gap-2 text-xs leading-6 text-muted">
                  <FaIcon
                    icon={totals.freeShipping ? "fa-circle-check" : "fa-truck"}
                    className={totals.freeShipping ? "text-shop" : "text-mocha"}
                  />
                  {totals.freeShipping
                    ? messages.shop.freeShippingDone
                    : messages.shop.freeShippingRemain(
                        formatToman(totals.remainingForFreeShipping),
                      )}
                </p>
                <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-page">
                  <div
                    className="h-full rounded-full bg-shop"
                    style={{ width: `${shippingProgress}%` }}
                  />
                </div>
              </div>

              <dl className="mt-5 space-y-3 text-sm">
                <div className="flex items-center justify-between">
                  <dt className="text-muted">
                    {messages.shop.itemsPrice} ({count.toLocaleString("fa-IR")})
                  </dt>
                  <dd>{formatToman(totals.compareAt)}</dd>
                </div>
                {totals.discount > 0 ? (
                  <div className="flex items-center justify-between text-sale">
                    <dt>{messages.shop.itemsDiscount}</dt>
                    <dd>{formatToman(totals.discount)}</dd>
                  </div>
                ) : null}
                <div className="flex items-center justify-between">
                  <dt className="text-muted">{messages.shop.shippingCost}</dt>
                  <dd>
                    {totals.freeShipping
                      ? messages.shop.shippingFreeLabel
                      : messages.shop.shippingLater}
                  </dd>
                </div>
                <div className="flex items-center justify-between border-t border-line/70 pt-3 text-base font-medium">
                  <dt>{messages.shop.payable}</dt>
                  <dd>{formatToman(totals.payable)}</dd>
                </div>
              </dl>

              <Link
                href="/checkout"
                className="mt-5 hidden h-12 w-full items-center justify-center rounded-xl bg-espresso text-sm text-white lg:inline-flex"
              >
                {messages.shop.checkout}
              </Link>
              <p className="mt-3 text-xs leading-6 text-muted">
                {messages.shop.cartNote}
              </p>
            </div>
          </aside>
        </div>
      )}

      {suggested.length > 0 ? (
        <section className="mt-12">
          <h2 className="mb-5 text-xl font-medium">
            {messages.shop.suggestedCart}
          </h2>
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {suggested.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      ) : null}

      {items.length > 0 ? (
        <div className="fixed inset-x-0 bottom-[calc(4rem+env(safe-area-inset-bottom))] z-30 border-t border-line bg-surface/95 px-4 py-3 backdrop-blur lg:hidden">
          <div className="mx-auto flex max-w-lg items-center gap-3">
            <div className="min-w-0">
              <p className="text-xs text-muted">{messages.shop.payable}</p>
              <p className="truncate text-sm font-medium">
                {formatToman(totals.payable)}
              </p>
            </div>
            <Link
              href="/checkout"
              className="inline-flex h-12 min-w-40 flex-1 items-center justify-center rounded-xl bg-espresso px-5 text-sm text-white"
            >
              {messages.shop.checkout}
            </Link>
          </div>
        </div>
      ) : null}
    </main>
  )
}

function EmptyCart() {
  return (
    <div className="mt-6 rounded-2xl bg-surface px-6 py-16 text-center shadow-card">
      <span className="mx-auto flex size-20 items-center justify-center rounded-full bg-soft text-3xl text-mocha">
        <FaIcon icon="fa-cart-shopping" />
      </span>
      <h2 className="mt-6 text-lg font-medium">{messages.shop.emptyCart}</h2>
      <p className="mt-2 text-sm text-muted">{messages.shop.emptyCartHint}</p>
      <Link
        href="/products"
        className="mt-8 inline-flex h-12 items-center rounded-xl bg-espresso px-6 text-sm text-white"
      >
        {messages.shop.continueShopping}
      </Link>
    </div>
  )
}
