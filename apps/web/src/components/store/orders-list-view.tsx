"use client"

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
  type FormEvent,
} from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { FaIcon } from "@/components/fa-icon"
import { ReviewFormDialog } from "@/components/store/review-form"
import { SwipeableTabs } from "@/components/store/swipeable-tabs"
import { formatToman } from "@/lib/catalog"
import { messages } from "@/lib/i18n"
import {
  findOrder,
  getOrderStorageSnapshot,
  patchOrder,
  readOrders,
  subscribeOrderStorage,
  type StoredOrder,
  type StoredOrderItem,
} from "@/lib/orders"
import { toPersianDigits } from "@/lib/phone"
import {
  findReviewForProduct,
  getFeedbackSnapshot,
  subscribeFeedback,
} from "@/lib/reviews"
import {
  deliveryAt,
  formatFaCalendar,
  formatFaFullDate,
  nextStage,
  normalizeOrderId,
  orderStage,
  purchaseTab,
  type PurchaseTab,
  type TrackStageId,
} from "@/lib/tracking"

const tabs: Array<{ id: PurchaseTab; label: string }> = [
  { id: "all", label: messages.track.tabAll },
  { id: "pay", label: messages.track.tabPay },
  { id: "ship", label: messages.track.tabShip },
  { id: "receive", label: messages.track.tabReceive },
  { id: "done", label: messages.track.tabDone },
  { id: "return", label: messages.track.tabReturn },
  { id: "cancelled", label: messages.track.tabCancelled },
]

const emptyCopy: Record<Exclude<PurchaseTab, "all">, string> = {
  pay: messages.track.emptyPay,
  ship: messages.track.emptyShip,
  receive: messages.track.emptyReceive,
  done: messages.track.emptyDone,
  return: messages.track.emptyReturn,
  cancelled: messages.track.emptyCancelled,
}

const statusLabels: Record<TrackStageId, string> = {
  placed: messages.track.statusPreparing,
  packed: messages.track.statusPreparing,
  handover: messages.track.statusHandover,
  transit: messages.track.statusTransit,
  out: messages.track.statusOut,
  delivered: messages.track.statusDelivered,
}

function tabLabel(order: StoredOrder) {
  const tab = purchaseTab(order)

  if (tab === "pay") {
    return messages.track.statusUnpaid
  }
  if (tab === "cancelled") {
    return messages.track.statusCancelled
  }
  if (tab === "return") {
    return messages.track.statusReturn
  }
  if (tab === "done") {
    return messages.track.statusCompleted
  }

  return statusLabels[orderStage(order)]
}

export function OrdersListView() {
  const router = useRouter()
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
  const feedbackRaw = useSyncExternalStore(
    subscribeFeedback,
    getFeedbackSnapshot,
    () => "",
  )
  const [tab, setTab] = useState<PurchaseTab>("all")
  const [searchOpen, setSearchOpen] = useState(false)
  const [query, setQuery] = useState("")
  const [lookupError, setLookupError] = useState("")
  const [reviewItem, setReviewItem] = useState<StoredOrderItem | null>(null)
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([])
  const tabIndex = Math.max(
    0,
    tabs.findIndex((item) => item.id === tab),
  )
  const onTabIndexChange = useCallback((next: number) => {
    setTab(tabs[next]?.id ?? "all")
  }, [])

  const orders = useMemo(() => (raw ? readOrders() : []), [raw])

  const counts = useMemo(() => {
    const next = {
      all: orders.length,
      pay: 0,
      ship: 0,
      receive: 0,
      done: 0,
      return: 0,
      cancelled: 0,
    }

    for (const order of orders) {
      next[purchaseTab(order)] += 1
    }

    return next
  }, [orders])

  const grouped = useMemo(() => {
    const next: Record<PurchaseTab, StoredOrder[]> = {
      all: orders,
      pay: [],
      ship: [],
      receive: [],
      done: [],
      return: [],
      cancelled: [],
    }

    for (const order of orders) {
      next[purchaseTab(order)].push(order)
    }

    return next
  }, [orders])

  useEffect(() => {
    const button = tabRefs.current[tabIndex]
    const list = button?.parentElement
    if (!button || !list) {
      return
    }

    const listRect = list.getBoundingClientRect()
    const buttonRect = button.getBoundingClientRect()
    list.scrollTo({
      left:
        list.scrollLeft +
        (buttonRect.left - listRect.left) -
        (listRect.width - buttonRect.width) / 2,
      behavior: "smooth",
    })
  }, [tabIndex])

  function onLookup(event: FormEvent) {
    event.preventDefault()
    const id = normalizeOrderId(query)

    if (!id) {
      setLookupError(messages.track.lookupInvalid)
      return
    }

    if (!findOrder(id)) {
      setLookupError(messages.track.lookupMiss)
      return
    }

    setLookupError("")
    router.push(`/orders/${id}`)
  }

  return (
    <section className="overflow-clip rounded-xl bg-surface shadow-card">
      <header className="flex items-center justify-between gap-3 border-b border-line px-4 py-4 sm:px-5">
        {searchOpen ? (
          <form onSubmit={onLookup} className="flex min-w-0 flex-1 items-center gap-2">
            <input
              id="order-lookup"
              name="orderId"
              value={query}
              onChange={(event) => {
                setQuery(event.target.value)
                setLookupError("")
              }}
              placeholder={messages.track.lookupPlaceholder}
              autoComplete="off"
              spellCheck={false}
              autoFocus
              dir="ltr"
              className="h-10 min-w-0 flex-1 rounded-lg border border-line bg-page px-3 text-left text-sm outline-none focus:border-mocha"
            />
            <button
              type="submit"
              className="h-10 shrink-0 rounded-lg bg-espresso px-3 text-sm text-white"
            >
              {messages.track.lookupSubmit}
            </button>
          </form>
        ) : (
          <h1 className="text-lg font-medium">{messages.track.historyTitle}</h1>
        )}
        <button
          type="button"
          className="flex size-10 shrink-0 items-center justify-center rounded-lg text-muted hover:bg-soft hover:text-ink"
          aria-label={messages.track.searchOrders}
          aria-expanded={searchOpen}
          onClick={() => {
            setSearchOpen((open) => !open)
            setLookupError("")
          }}
        >
          <FaIcon icon={searchOpen ? "fa-xmark" : "fa-magnifying-glass"} />
        </button>
      </header>
      {lookupError ? (
        <p className="border-b border-line px-4 py-3 text-sm text-error" role="alert">
          {lookupError}
        </p>
      ) : null}

      <div
        className="no-scrollbar flex gap-1 overflow-x-auto border-b border-line px-2 sm:px-4"
        role="tablist"
        aria-label={messages.track.historyTitle}
      >
        {tabs.map((item, itemIndex) => {
          const count = counts[item.id]
          const selected = tab === item.id

          return (
            <button
              key={item.id}
              ref={(node) => {
                tabRefs.current[itemIndex] = node
              }}
              type="button"
              id={`orders-tab-${item.id}`}
              role="tab"
              aria-selected={selected}
              aria-controls={`orders-panel-${item.id}`}
              onClick={() => setTab(item.id)}
              className={`inline-flex shrink-0 items-center gap-2 border-b-2 px-3 py-3 text-sm ${
                selected
                  ? "border-sale text-sale"
                  : "border-transparent text-muted hover:text-ink"
              }`}
            >
              {item.label}
              <span
                className={`inline-flex min-w-5 items-center justify-center rounded-full px-1.5 text-[11px] ${
                  selected ? "bg-sale text-white" : "bg-soft text-muted"
                }`}
              >
                {count.toLocaleString("fa-IR")}
              </span>
            </button>
          )
        })}
      </div>

      <SwipeableTabs index={tabIndex} onIndexChange={onTabIndexChange}>
        {tabs.map((item) => (
          <div
            key={item.id}
            id={`orders-panel-${item.id}`}
            role="tabpanel"
            aria-labelledby={`orders-tab-${item.id}`}
            className="p-4 sm:p-5"
          >
            <OrdersPanel
              hydrated={hydrated}
              tab={item.id}
              orders={grouped[item.id]}
              feedbackKey={feedbackRaw}
              onReview={setReviewItem}
            />
          </div>
        ))}
      </SwipeableTabs>

      {reviewItem ? (
        <ReviewFormDialog
          product={{
            id: reviewItem.productId,
            title: reviewItem.title,
            href: reviewItem.href,
            image: reviewItem.image,
          }}
          open
          onClose={() => setReviewItem(null)}
        />
      ) : null}
    </section>
  )
}

function OrdersPanel({
  hydrated,
  tab,
  orders,
  feedbackKey,
  onReview,
}: {
  hydrated: boolean
  tab: PurchaseTab
  orders: StoredOrder[]
  feedbackKey: string
  onReview: (item: StoredOrderItem) => void
}) {
  if (!hydrated) {
    return <p className="text-sm text-muted">{messages.shop.loading}</p>
  }

  if (orders.length === 0) {
    return (
      <div className="flex min-h-80 flex-col items-center justify-center py-12 text-center">
        <p className="text-sm font-medium">
          {tab === "all" ? messages.track.empty : emptyCopy[tab]}
        </p>
        <p className="mt-2 text-sm leading-7 text-muted">
          {messages.track.emptyHint}
        </p>
        <Link
          href="/products"
          className="mt-6 inline-flex h-11 items-center rounded-full bg-espresso px-6 text-sm text-white"
        >
          {messages.track.shopNow}
        </Link>
      </div>
    )
  }

  return (
    <ul className="space-y-4">
      {orders.map((order) => (
        <OrderCard
          key={order.id}
          order={order}
          feedbackKey={feedbackKey}
          onReview={onReview}
        />
      ))}
    </ul>
  )
}

function OrderCard({
  order,
  feedbackKey,
  onReview,
}: {
  order: StoredOrder
  feedbackKey: string
  onReview: (item: StoredOrderItem) => void
}) {
  const stage = orderStage(order)
  const upcoming = nextStage(stage)
  const tab = purchaseTab(order)
  const unreviewed = order.items.find(
    (item) => !findReviewForProduct(item.productId),
  )

  void feedbackKey

  return (
    <li>
      <article className="overflow-hidden rounded-xl border border-line">
        <Link
          href={`/orders/${order.id}`}
          draggable={false}
          className="block p-4 hover:bg-soft/40 sm:p-5"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <div
                className={`flex items-center gap-2 ${
                  tab === "cancelled" || tab === "return"
                    ? "text-muted"
                    : tab === "pay"
                      ? "text-sale"
                      : "text-success"
                }`}
              >
                <span
                  className={`flex size-7 items-center justify-center rounded-full ${
                    tab === "cancelled" || tab === "return"
                      ? "bg-soft"
                      : tab === "pay"
                        ? "bg-sale/15"
                        : "bg-success/15"
                  }`}
                >
                  <FaIcon
                    icon={
                      tab === "done"
                        ? "fa-circle-check"
                        : tab === "cancelled"
                          ? "fa-ban"
                          : tab === "pay"
                            ? "fa-wallet"
                            : "fa-ellipsis"
                    }
                    className="text-xs"
                  />
                </span>
                <p className="text-sm font-medium">{tabLabel(order)}</p>
              </div>
              <dl className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-xs text-muted">
                <div>
                  <dt className="sr-only">{messages.track.placedAt}</dt>
                  <dd>{formatFaCalendar(order.createdAt)}</dd>
                </div>
                <div>
                  <dt className="inline">{messages.pay.orderId} </dt>
                  <dd className="inline" dir="ltr">
                    {toPersianDigits(order.id)}
                  </dd>
                </div>
                <div>
                  <dt className="inline">{messages.track.total} </dt>
                  <dd className="inline">{formatToman(order.totals.payable)}</dd>
                </div>
              </dl>
            </div>
            <span
              className="flex size-9 shrink-0 items-center justify-center text-muted"
              aria-hidden="true"
            >
              <FaIcon icon="fa-chevron-left" className="text-xs" />
            </span>
          </div>

          {tab === "ship" || tab === "receive" ? (
            <div
              className={`mt-4 grid gap-3 ${upcoming ? "grid-cols-2" : "grid-cols-1"}`}
            >
              <div>
                <p className="mb-2 text-xs text-success">{statusLabels[stage]}</p>
                <div className="h-1.5 rounded-full bg-success" />
              </div>
              {upcoming ? (
                <div>
                  <p className="mb-2 text-xs text-muted">
                    {messages.track.nextStep(
                      upcoming === "packed"
                        ? messages.track.statusPacked
                        : statusLabels[upcoming],
                    )}
                  </p>
                  <div className="h-1.5 rounded-full bg-soft" />
                </div>
              ) : null}
            </div>
          ) : null}

          {tab === "ship" || tab === "receive" ? (
            <p className="mt-4 text-sm text-muted">
              {messages.track.deliverySlot(
                formatFaFullDate(deliveryAt(order.paidAt ?? order.createdAt)),
              )}
            </p>
          ) : null}

          <ul className="mt-4 flex flex-wrap gap-2">
            {order.items.slice(0, 5).map((item) => (
              <li
                key={`${order.id}-${item.productId}-${item.size}`}
                className="relative size-16 overflow-hidden rounded-lg bg-soft sm:size-18"
              >
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  sizes="72px"
                  className="object-cover"
                />
              </li>
            ))}
          </ul>
        </Link>

        {tab === "pay" ||
        tab === "ship" ||
        tab === "receive" ||
        tab === "done" ? (
          <div className="flex flex-wrap justify-end gap-2 border-t border-line px-4 py-3">
            {tab === "pay" ? (
              <>
                <ActionButton
                  tone="muted"
                  onClick={() => patchOrder(order.id, { lifecycle: "cancelled" })}
                >
                  {messages.track.cancelOrder}
                </ActionButton>
                <ActionButton
                  tone="primary"
                  onClick={() =>
                    patchOrder(order.id, {
                      lifecycle: "ship",
                      paidAt: Date.now(),
                    })
                  }
                >
                  {messages.track.payNow}
                </ActionButton>
              </>
            ) : null}
            {tab === "ship" ? (
              <ActionButton
                tone="muted"
                onClick={() => patchOrder(order.id, { lifecycle: "cancelled" })}
              >
                {messages.track.cancelOrder}
              </ActionButton>
            ) : null}
            {tab === "receive" ? (
              <>
                <ActionButton
                  tone="muted"
                  onClick={() => patchOrder(order.id, { lifecycle: "return" })}
                >
                  {messages.track.requestReturn}
                </ActionButton>
                <ActionButton
                  tone="primary"
                  onClick={() => patchOrder(order.id, { lifecycle: "done" })}
                >
                  {messages.track.confirmReceived}
                </ActionButton>
              </>
            ) : null}
            {tab === "done" ? (
              <>
                <ActionButton
                  tone="muted"
                  onClick={() => patchOrder(order.id, { lifecycle: "return" })}
                >
                  {messages.track.requestReturn}
                </ActionButton>
                {unreviewed ? (
                  <ActionButton tone="primary" onClick={() => onReview(unreviewed)}>
                    {messages.track.rateOrder}
                  </ActionButton>
                ) : null}
              </>
            ) : null}
          </div>
        ) : null}
      </article>
    </li>
  )
}

function ActionButton({
  children,
  onClick,
  tone,
}: {
  children: string
  onClick: () => void
  tone: "primary" | "muted"
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex h-10 items-center rounded-lg px-4 text-sm ${
        tone === "primary"
          ? "bg-espresso text-white"
          : "border border-line text-muted hover:border-mocha hover:text-ink"
      }`}
    >
      {children}
    </button>
  )
}
