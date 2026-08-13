"use client"

import Image from "next/image"
import Link from "next/link"
import { useEffect, useRef } from "react"
import { FaIcon } from "@/components/fa-icon"
import { colorLabel, productSku, products } from "@/lib/catalog"
import type { CartLine } from "@/lib/cart"
import { messages } from "@/lib/i18n"

export function CartAddedDialog({
  item,
  onClose,
}: {
  item: CartLine
  onClose: () => void
}) {
  const closeRef = useRef<HTMLButtonElement>(null)
  const product = products.find((entry) => entry.id === item.productId)

  useEffect(() => {
    closeRef.current?.focus()

    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose()
      }
    }

    const previous = document.body.style.overflow
    document.body.style.overflow = "hidden"
    window.addEventListener("keydown", onKey)

    return () => {
      document.body.style.overflow = previous
      window.removeEventListener("keydown", onKey)
    }
  }, [onClose])

  const title = product
    ? `${product.title} ${productSku(product)} – ${colorLabel(item.color)}, ${item.size}`
    : `${colorLabel(item.color)}, ${item.size}`

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-4"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="cart-added-title"
        className="w-full max-w-xl rounded-2xl bg-surface p-5 shadow-lg sm:p-6"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-center gap-3 border-b border-line pb-4">
          <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-success text-white">
            <FaIcon icon="fa-check" className="text-sm" />
          </span>
          <p
            id="cart-added-title"
            className="min-w-0 flex-1 text-sm font-medium text-success sm:text-base"
          >
            {messages.shop.addedToCartTitle}
          </p>
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            className="flex size-8 shrink-0 items-center justify-center rounded-lg text-muted hover:bg-soft hover:text-ink"
            aria-label={messages.shop.close}
          >
            <FaIcon icon="fa-xmark" />
          </button>
        </div>

        <div className="flex items-start gap-4 py-5">
          {product ? (
            <Link
              href={product.href}
              onClick={onClose}
              className="relative size-20 shrink-0 overflow-hidden rounded-lg bg-soft"
            >
              <Image
                src={product.image}
                alt={product.title}
                fill
                sizes="80px"
                className="object-cover"
              />
            </Link>
          ) : null}
          <div className="min-w-0 pt-0.5">
            <p className="text-sm leading-7">{title}</p>
            <p className="mt-1 text-sm text-success">
              {messages.shop.addedQty(item.quantity)}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Link
            href="/"
            onClick={onClose}
            className="inline-flex h-12 items-center justify-center rounded-lg border border-line bg-surface text-sm text-ink"
          >
            {messages.shop.goToHome}
          </Link>
          <Link
            href="/cart"
            onClick={onClose}
            className="inline-flex h-12 items-center justify-center rounded-lg bg-bronze text-sm text-white"
          >
            {messages.shop.goToCart}
          </Link>
        </div>
      </div>
    </div>
  )
}
