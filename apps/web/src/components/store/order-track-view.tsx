"use client"

import { useMemo, useState, useSyncExternalStore } from "react"
import Image from "next/image"
import Link from "next/link"
import { FaIcon } from "@/components/fa-icon"
import { formatToman } from "@/lib/catalog"
import { messages } from "@/lib/i18n"
import { formatPhoneForDisplay } from "@/lib/phone"
import {
  findOrder,
  getOrderStorageSnapshot,
  patchOrder,
  subscribeOrderStorage,
  type PaymentMethodId,
} from "@/lib/orders"
import {
  etaRange,
  formatFaDate,
  formatFaDateTime,
  maskPhone,
  maskPostal,
  maskStreet,
  normalizeOrderId,
  occurredEvents,
  orderClock,
  orderStage,
  purchaseTab,
  trackingNumber,
  type TrackStageId,
} from "@/lib/tracking"

const paymentLabel: Record<PaymentMethodId, string> = {
  cod: messages.pay.methodCod,
  online: messages.pay.methodOnline,
  snapp: messages.pay.methodSnapp,
  tara: messages.pay.methodTara,
}

const statusTitle: Record<TrackStageId, string> = {
  placed: messages.track.statusPlaced,
  packed: messages.track.statusPacked,
  handover: messages.track.statusHandover,
  transit: messages.track.statusTransit,
  out: messages.track.statusOut,
  delivered: messages.track.statusDelivered,
}

const statusBody: Record<TrackStageId, string> = {
  placed: messages.track.statusPlacedBody,
  packed: messages.track.statusPackedBody,
  handover: messages.track.statusHandoverBody,
  transit: messages.track.statusTransitBody,
  out: messages.track.statusOutBody,
  delivered: messages.track.statusDeliveredBody,
}

const statusIcon: Record<TrackStageId, string> = {
  placed: "fa-receipt",
  packed: "fa-box",
  handover: "fa-truck",
  transit: "fa-truck-fast",
  out: "fa-location-dot",
  delivered: "fa-circle-check",
}

export function OrderTrackView({ orderId }: { orderId: string }) {
  const hydrated = useSyncExternalStore(
    () => () => undefined,
    () => true,
    () => false,
  )
  const raw = useSyncExternalStore(
    subscribeOrderStorage,
    getOrderStorageSnapshot,
    () => "",
  )
  const [revealed, setRevealed] = useState(false)
  const [copied, setCopied] = useState<"order" | "track" | "">("")

  const id = normalizeOrderId(orderId)
  const order = useMemo(
    () => (id && raw ? findOrder(id) : null),
    [id, raw],
  )

  const clock = order ? orderClock(order) : 0
  const stage = order ? orderStage(order) : "placed"
  const events = order ? occurredEvents(clock) : []
  const eta = order ? etaRange(clock) : null
  const parcelCode = order ? trackingNumber(order.id) : ""
  const tab = order ? purchaseTab(order) : "ship"

  async function copy(value: string, kind: "order" | "track") {
    try {
      await navigator.clipboard.writeText(value)
      setCopied(kind)
      window.setTimeout(() => setCopied(""), 2000)
    } catch {
      setCopied("")
    }
  }

  if (!hydrated) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-10">
        <p className="text-sm text-muted">{messages.shop.loading}</p>
      </main>
    )
  }

  if (!order) {
    return (
      <main className="mx-auto max-w-lg px-4 py-16 text-center">
        <span className="mx-auto flex size-14 items-center justify-center rounded-full bg-soft text-mocha">
          <FaIcon icon="fa-box-open" />
        </span>
        <h1 className="mt-5 text-2xl font-medium">{messages.track.notFound}</h1>
        <p className="mt-3 text-sm leading-7 text-muted">
          {messages.track.notFoundHint}
        </p>
        <Link
          href="/orders"
          className="mt-8 inline-flex h-11 items-center rounded-full bg-espresso px-6 text-sm text-white"
        >
          {messages.track.back}
        </Link>
      </main>
    )
  }

  const delivered = tab === "done" || stage === "delivered"
  const headline =
    tab === "pay"
      ? messages.track.statusUnpaid
      : tab === "cancelled"
        ? messages.track.statusCancelled
        : tab === "return"
          ? messages.track.statusReturn
          : tab === "done"
            ? messages.track.statusCompleted
            : statusTitle[stage]

  return (
    <main className="mx-auto max-w-3xl px-4 py-6 pb-24">
      <nav className="mb-5 text-xs text-cocoa">
        <Link href="/" className="hover:text-ink">
          {messages.shop.breadcrumbHome}
        </Link>
        <span className="px-2" aria-hidden="true">
          /
        </span>
        <Link href="/orders" className="hover:text-ink">
          {messages.track.myOrders}
        </Link>
        <span className="px-2" aria-hidden="true">
          /
        </span>
        <span className="text-ink">{messages.track.nav}</span>
      </nav>

      <section
        className={`relative overflow-hidden rounded-3xl px-5 py-6 text-bone sm:px-7 ${
          delivered ? "bg-[#1d3b2a]" : "login-panel"
        }`}
      >
        <div className="login-grain opacity-15" />
        <div className="relative flex items-start gap-4">
          <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-white/10 text-bronze">
            <FaIcon icon={statusIcon[stage]} />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-xs text-bronze">{messages.track.nav}</p>
            <h1 className="mt-1 text-2xl font-medium">{headline}</h1>
            <p className="mt-2 text-sm leading-7 text-oat">
              {statusBody[stage]}
            </p>
            <p className="mt-4 text-sm">
              {delivered ? (
                <>
                  {messages.track.deliveredOn}{" "}
                  {formatFaDateTime(events[0]?.at ?? order.createdAt)}
                </>
              ) : eta ? (
                <>
                  {messages.track.eta}:{" "}
                  {messages.track.etaValue(
                    formatFaDate(eta.from),
                    formatFaDate(eta.to),
                  )}
                </>
              ) : null}
            </p>
          </div>
        </div>
      </section>

      <section className="mt-4 rounded-2xl bg-surface p-5 shadow-card">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs text-muted">{messages.track.courier}</p>
            <p className="mt-1 text-sm font-medium">
              {messages.track.courierName}
            </p>
          </div>
          <CopyField
            label={messages.track.trackingNo}
            value={parcelCode}
            copied={copied === "track"}
            onCopy={() => copy(parcelCode, "track")}
          />
        </div>
        <p className="mt-4 text-xs leading-6 text-muted">
          {order.payment === "cod"
            ? messages.track.payCodNote
            : messages.track.payOnlineNote}
        </p>
      </section>

      <section className="mt-4 rounded-2xl bg-surface p-5 shadow-card">
        <h2 className="text-sm font-medium">{messages.track.timeline}</h2>
        <ol className="mt-5">
          {events.map((event, index) => {
            const current = index === 0

            return (
              <li key={event.id} className="flex gap-4">
                <div className="flex w-6 flex-col items-center">
                  <span
                    className={`mt-1 size-3 rounded-full ring-4 ${
                      current
                        ? "bg-mocha ring-mocha/20"
                        : "bg-line ring-transparent"
                    }`}
                  />
                  {index < events.length - 1 ? (
                    <span className="w-px flex-1 bg-line" />
                  ) : null}
                </div>
                <div className={index < events.length - 1 ? "pb-6" : "pb-1"}>
                  <p
                    className={`text-sm ${current ? "font-medium text-mocha" : ""}`}
                  >
                    {statusTitle[event.id]}
                  </p>
                  <p className="mt-1 text-xs text-muted">
                    {formatFaDateTime(event.at)}
                  </p>
                  <p className="mt-1 text-sm leading-7 text-muted">
                    {statusBody[event.id]}
                  </p>
                </div>
              </li>
            )
          })}
        </ol>
      </section>

      <section className="mt-4 rounded-2xl bg-surface p-5 shadow-card">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs text-muted">{messages.track.recipient}</p>
            <p className="mt-1 text-sm font-medium">{order.address.name}</p>
            <p className="mt-1 text-sm" dir="ltr">
              {revealed
                ? formatPhoneForDisplay(order.address.phone)
                : maskPhone(order.address.phone)}
            </p>
          </div>
          <button
            type="button"
            onClick={() => setRevealed((value) => !value)}
            className="shrink-0 text-xs text-mocha hover:underline"
          >
            {revealed ? messages.track.hideAddress : messages.track.showAddress}
          </button>
        </div>
        <p className="mt-4 text-sm leading-7">
          {order.address.province}، {order.address.city}
          {revealed
            ? `، ${order.address.address} — ${messages.pay.postal} ${order.address.postal}`
            : `، ${maskStreet(order.address.address)} — ${messages.pay.postal} ${maskPostal(order.address.postal)}`}
        </p>
        <p className="mt-3 text-xs leading-6 text-muted">
          {messages.track.addressHint}
        </p>
      </section>

      <section className="mt-4 rounded-2xl bg-surface p-5 shadow-card">
        <h2 className="text-sm font-medium">{messages.track.items}</h2>
        <ul className="mt-4 divide-y divide-line">
          {order.items.map((item) => (
            <li key={`${item.productId}-${item.color}-${item.size}`} className="py-4 first:pt-0 last:pb-0">
              <div className="flex gap-3">
                <Link
                  href={item.href}
                  className="relative size-16 shrink-0 overflow-hidden rounded-xl bg-soft"
                >
                  <Image
                    src={item.image}
                    alt=""
                    fill
                    sizes="64px"
                    className="object-cover"
                  />
                </Link>
                <div className="min-w-0 flex-1">
                  <Link href={item.href} className="line-clamp-2 text-sm leading-6 hover:text-mocha">
                    {item.title}
                  </Link>
                  <p className="mt-1 text-xs text-muted">
                    {item.colorName} | {messages.shop.chooseSize} {item.size}
                  </p>
                </div>
                <div className="text-left text-sm">
                  <p>{formatToman(item.price * item.quantity)}</p>
                  <p className="mt-1 text-xs text-muted">
                    {messages.track.qty(item.quantity)}
                  </p>
                </div>
              </div>
            </li>
          ))}
        </ul>
        <dl className="mt-4 space-y-2 border-t border-line pt-4 text-sm">
          <Row label={messages.shop.itemsPrice} value={formatToman(order.totals.itemsPrice)} />
          {order.totals.discount > 0 ? (
            <Row
              label={messages.shop.itemsDiscount}
              value={formatToman(order.totals.discount)}
            />
          ) : null}
          <Row
            label={messages.shop.shippingCost}
            value={
              order.totals.shipping === 0
                ? messages.shop.shippingFreeLabel
                : formatToman(order.totals.shipping)
            }
          />
          <Row
            label={messages.pay.payment}
            value={paymentLabel[order.payment]}
          />
          <div className="flex justify-between pt-1 text-base font-medium">
            <dt>{messages.track.total}</dt>
            <dd>{formatToman(order.totals.payable)}</dd>
          </div>
        </dl>
      </section>

      <section className="mt-4 rounded-2xl bg-surface p-5 shadow-card">
        <CopyField
          label={messages.pay.orderId}
          value={order.id}
          copied={copied === "order"}
          onCopy={() => copy(order.id, "order")}
        />
        <p className="mt-3 text-sm text-muted">
          {messages.track.placedAt}: {formatFaDateTime(order.createdAt)}
        </p>
        <p className="mt-3 text-xs leading-6 text-muted">{messages.track.privacy}</p>
      </section>

      <div className="mt-6 flex flex-wrap gap-3">
        {tab === "pay" ? (
          <>
            <button
              type="button"
              className="inline-flex h-11 items-center rounded-full border border-line px-5 text-sm hover:border-mocha"
              onClick={() => patchOrder(order.id, { lifecycle: "cancelled" })}
            >
              {messages.track.cancelOrder}
            </button>
            <button
              type="button"
              className="inline-flex h-11 items-center rounded-full bg-espresso px-5 text-sm text-white"
              onClick={() =>
                patchOrder(order.id, {
                  lifecycle: "ship",
                  paidAt: Date.now(),
                })
              }
            >
              {messages.track.payNow}
            </button>
          </>
        ) : null}
        {tab === "ship" ? (
          <button
            type="button"
            className="inline-flex h-11 items-center rounded-full border border-line px-5 text-sm hover:border-mocha"
            onClick={() => patchOrder(order.id, { lifecycle: "cancelled" })}
          >
            {messages.track.cancelOrder}
          </button>
        ) : null}
        {tab === "receive" ? (
          <>
            <button
              type="button"
              className="inline-flex h-11 items-center rounded-full border border-line px-5 text-sm hover:border-mocha"
              onClick={() => patchOrder(order.id, { lifecycle: "return" })}
            >
              {messages.track.requestReturn}
            </button>
            <button
              type="button"
              className="inline-flex h-11 items-center rounded-full bg-espresso px-5 text-sm text-white"
              onClick={() => patchOrder(order.id, { lifecycle: "done" })}
            >
              {messages.track.confirmReceived}
            </button>
          </>
        ) : null}
        {tab === "done" ? (
          <Link
            href="/account/comments"
            className="inline-flex h-11 items-center rounded-full bg-espresso px-5 text-sm text-white"
          >
            {messages.track.rateOrder}
          </Link>
        ) : null}
        <Link
          href="/faq#shipping"
          className="inline-flex h-11 items-center rounded-full border border-line px-5 text-sm hover:border-mocha"
        >
          {messages.track.helpFaq}
        </Link>
        <a
          href={`mailto:${messages.shop.email}`}
          className="inline-flex h-11 items-center rounded-full border border-line px-5 text-sm hover:border-mocha"
        >
          {messages.track.help}
        </a>
      </div>
    </main>
  )
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4">
      <dt className="text-muted">{label}</dt>
      <dd>{value}</dd>
    </div>
  )
}

function CopyField({
  label,
  value,
  copied,
  onCopy,
}: {
  label: string
  value: string
  copied: boolean
  onCopy: () => void
}) {
  return (
    <div>
      <p className="text-xs text-muted">{label}</p>
      <div className="mt-1 flex items-center gap-2">
        <span className="font-medium" dir="ltr">
          {value}
        </span>
        <button
          type="button"
          onClick={onCopy}
          className="inline-flex size-8 items-center justify-center rounded-lg text-mocha hover:bg-soft"
          aria-label={messages.track.copy}
        >
          <FaIcon icon={copied ? "fa-check" : "fa-copy"} className="text-xs" />
        </button>
      </div>
      <p className="sr-only" aria-live="polite">
        {copied ? messages.track.copied : ""}
      </p>
    </div>
  )
}
