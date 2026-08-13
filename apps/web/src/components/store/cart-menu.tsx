"use client"

import Image from "next/image"
import Link from "next/link"
import { useMemo } from "react"
import { FaIcon } from "@/components/fa-icon"
import { CartBadge } from "@/components/store/cart-badge"
import { useCart } from "@/components/store/cart-provider"
import { colorLabel, formatToman, productSku } from "@/lib/catalog"
import { cartTotals, lineKey, resolveCart } from "@/lib/cart"
import { messages } from "@/lib/i18n"

export function CartMenu() {
  const { lines, removeItem } = useCart()
  const items = useMemo(() => resolveCart(lines), [lines])
  const totals = useMemo(() => cartTotals(items), [items])

  return (
    <div className="group relative hidden sm:block">
      <Link
        href="/cart"
        className="relative inline-flex size-11 items-center justify-center rounded-xl border border-line hover:border-mocha hover:text-mocha"
        aria-label={messages.shop.cart}
      >
        <FaIcon icon="fa-cart-shopping" />
        <CartBadge />
      </Link>

      <div className="pointer-events-none invisible absolute top-full left-0 z-50 w-[22rem] pt-2 opacity-0 transition group-hover:pointer-events-auto group-hover:visible group-hover:opacity-100 group-focus-within:pointer-events-auto group-focus-within:visible group-focus-within:opacity-100">
        <div className="rounded-xl bg-surface p-4 shadow-lg ring-1 ring-line">
          {items.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted">
              {messages.shop.emptyCart}
            </p>
          ) : (
            <>
              <ul className="max-h-72 space-y-4 overflow-y-auto">
                {items.map((item) => {
                  const key = lineKey(item)
                  const title = `${item.product.title} ${productSku(item.product)} - ${colorLabel(item.color)}`

                  return (
                    <li key={key} className="flex gap-3">
                      <div className="relative shrink-0">
                        <Link
                          href={item.product.href}
                          className="relative block size-16 overflow-hidden rounded-lg bg-soft"
                        >
                          <Image
                            src={item.product.image}
                            alt={item.product.title}
                            fill
                            sizes="64px"
                            className="object-cover"
                          />
                        </Link>
                        <button
                          type="button"
                          onClick={() => removeItem(key)}
                          className="absolute -top-1 -right-1 flex size-5 items-center justify-center rounded-full bg-surface text-[10px] text-muted shadow-sm ring-1 ring-line hover:text-sale"
                          aria-label={messages.shop.removeItem}
                        >
                          <FaIcon icon="fa-xmark" />
                        </button>
                      </div>
                      <div className="min-w-0 flex-1">
                        <Link
                          href={item.product.href}
                          className="line-clamp-2 text-sm leading-6 hover:text-mocha"
                        >
                          {title}
                        </Link>
                        <p className="mt-1 text-xs text-muted">{item.size}</p>
                        <p className="mt-1 text-xs">
                          {messages.shop.cartUnitPrice(
                            item.quantity,
                            item.product.price,
                          )}
                        </p>
                      </div>
                    </li>
                  )
                })}
              </ul>

              <p className="mt-4 border-t border-line pt-3 text-sm font-medium">
                {formatToman(totals.payable)}
              </p>

              <div className="mt-4 grid grid-cols-2 gap-2">
                <Link
                  href="/cart"
                  className="inline-flex h-11 items-center justify-center rounded-lg border border-line bg-surface text-sm"
                >
                  {messages.shop.addedViewCart}
                </Link>
                <Link
                  href="/cart"
                  className="inline-flex h-11 items-center justify-center rounded-lg bg-bronze text-sm text-white"
                >
                  {messages.shop.miniCheckout}
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
