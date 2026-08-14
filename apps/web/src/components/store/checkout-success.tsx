"use client"

import Link from "next/link"
import { useMemo, useSyncExternalStore } from "react"
import { FaIcon } from "@/components/fa-icon"
import { formatToman } from "@/lib/catalog"
import { messages } from "@/lib/i18n"
import {
  findOrder,
  getOrderStorageSnapshot,
  subscribeOrderStorage,
  type PaymentMethodId,
} from "@/lib/orders"

const paymentLabel: Record<PaymentMethodId, string> = {
  cod: messages.pay.methodCod,
  online: messages.pay.methodOnline,
  snapp: messages.pay.methodSnapp,
  tara: messages.pay.methodTara,
}

export function CheckoutSuccess({ orderId }: { orderId: string }) {
  const raw = useSyncExternalStore(
    subscribeOrderStorage,
    getOrderStorageSnapshot,
    () => "",
  )
  const order = useMemo(
    () => (orderId && raw ? findOrder(orderId) : null),
    [orderId, raw],
  )

  if (!order) {
    return (
      <main className="mx-auto max-w-lg px-4 py-16 text-center">
        <h1 className="text-2xl font-medium">{messages.pay.title}</h1>
        <p className="mt-4 text-muted">{messages.pay.empty}</p>
        <Link
          href="/cart"
          className="mt-8 inline-flex h-12 items-center rounded-xl bg-espresso px-6 text-sm text-white"
        >
          {messages.pay.viewCart}
        </Link>
      </main>
    )
  }

  return (
    <main className="mx-auto max-w-lg px-4 py-12">
      <div className="rounded-2xl bg-surface p-6 text-center shadow-card sm:p-8">
        <span className="mx-auto flex size-16 items-center justify-center rounded-full bg-success text-2xl text-white">
          <FaIcon icon="fa-check" />
        </span>
        <h1 className="mt-5 text-2xl font-medium">{messages.pay.successTitle}</h1>
        <p className="mt-3 text-sm leading-7 text-muted">
          {order.payment === "cod"
            ? messages.pay.successCod
            : messages.pay.successOnline}
        </p>
        <p className="mt-5 text-sm">
          {messages.pay.orderId}:{" "}
          <span className="font-medium" dir="ltr">
            {order.id}
          </span>
        </p>
        <dl className="mt-6 space-y-2 border-t border-line pt-5 text-right text-sm">
          <div className="flex justify-between">
            <dt className="text-muted">{messages.pay.payment}</dt>
            <dd>{paymentLabel[order.payment]}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-muted">{messages.shop.payable}</dt>
            <dd>{formatToman(order.totals.payable)}</dd>
          </div>
          <div className="flex justify-between gap-6">
            <dt className="shrink-0 text-muted">{messages.pay.address}</dt>
            <dd className="leading-7">
              {order.address.province}، {order.address.city}
            </dd>
          </div>
        </dl>
        <div className="mt-8 flex flex-col gap-3">
          <Link
            href={`/orders/${order.id}`}
            className="inline-flex h-12 w-full items-center justify-center rounded-xl bg-espresso text-sm text-white"
          >
            {messages.track.trackParcel}
          </Link>
          <Link
            href="/orders"
            className="inline-flex h-12 w-full items-center justify-center rounded-xl border border-line text-sm hover:border-mocha"
          >
            {messages.track.myOrders}
          </Link>
          <Link
            href="/products"
            className="inline-flex h-12 w-full items-center justify-center text-sm text-muted hover:text-ink"
          >
            {messages.pay.backHome}
          </Link>
        </div>
      </div>
    </main>
  )
}
