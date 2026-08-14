"use client"

import { useMemo, useState, useSyncExternalStore } from "react"
import { FaIcon } from "@/components/fa-icon"
import { ProductCard } from "@/components/store/product-card"
import { products } from "@/lib/catalog"
import { messages } from "@/lib/i18n"
import {
  getWishlistNotifySnapshot,
  getWishlistSnapshot,
  readWishlist,
  setWishlistNotify,
  subscribeWishlist,
  subscribeWishlistNotify,
  toggleWishlist,
} from "@/lib/lists"

type ListTab = "wishlist" | "other" | "alerts"

const tabs: Array<{ id: ListTab; label: string }> = [
  { id: "wishlist", label: messages.account.tabWishlist },
  { id: "other", label: messages.account.tabOtherLists },
  { id: "alerts", label: messages.account.tabAlerts },
]

export function ListsView() {
  const [tab, setTab] = useState<ListTab>("wishlist")
  const hydrated = useSyncExternalStore(
    () => () => undefined,
    () => true,
    () => false,
  )
  const raw = useSyncExternalStore(
    subscribeWishlist,
    getWishlistSnapshot,
    () => "",
  )
  const notifyRaw = useSyncExternalStore(
    subscribeWishlistNotify,
    getWishlistNotifySnapshot,
    () => "1",
  )
  const ids = useMemo(() => (raw ? readWishlist() : []), [raw])
  const items = useMemo(
    () =>
      ids.flatMap((id) => {
        const product = products.find((item) => item.id === id)
        return product ? [product] : []
      }),
    [ids],
  )
  const notifyOn = notifyRaw !== "0"

  return (
    <section className="overflow-hidden rounded-xl bg-surface shadow-card">
      <header className="px-5 pt-4">
        <h1 className="text-[15px] font-medium">{messages.account.lists}</h1>
      </header>

      <div
        className="no-scrollbar mt-2 flex gap-1 overflow-x-auto border-b border-line px-2 sm:px-4"
        role="tablist"
        aria-label={messages.account.lists}
      >
        {tabs.map((item) => {
          const selected = tab === item.id

          return (
            <button
              key={item.id}
              type="button"
              role="tab"
              aria-selected={selected}
              onClick={() => setTab(item.id)}
              className={`shrink-0 border-b-2 px-3 py-3 text-sm ${
                selected
                  ? "border-sale text-sale"
                  : "border-transparent text-muted hover:text-ink"
              }`}
            >
              {item.label}
            </button>
          )
        })}
      </div>

      {tab === "wishlist" ? (
        <div className="flex items-center gap-3 border-b border-line px-5 py-3">
          <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-soft text-muted">
            <FaIcon icon="fa-bell" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-sm">{messages.account.notifyTitle}</p>
            <p className="mt-0.5 text-xs leading-6 text-muted">
              {messages.account.notifyHint}
            </p>
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={notifyOn}
            aria-label={
              notifyOn ? messages.account.notifyOn : messages.account.notifyOff
            }
            onClick={() => setWishlistNotify(!notifyOn)}
            className={`relative h-6 w-11 shrink-0 rounded-full transition ${
              notifyOn ? "bg-shop" : "bg-line"
            }`}
          >
            <span
              className={`absolute top-0.5 size-5 rounded-full bg-white shadow-sm transition ${
                notifyOn ? "inset-e-0.5" : "inset-s-0.5"
              }`}
            />
          </button>
        </div>
      ) : null}

      {!hydrated ? (
        <p className="px-5 py-16 text-center text-sm text-muted">
          {messages.shop.loading}
        </p>
      ) : tab === "wishlist" && items.length > 0 ? (
        <ul className="grid gap-4 p-5 sm:grid-cols-2 xl:grid-cols-3">
          {items.map((product) => (
            <li key={product.id} className="relative">
              <ProductCard product={product} />
              <button
                type="button"
                className="absolute top-3 inset-s-3 z-10 flex size-9 items-center justify-center rounded-lg bg-surface text-sale shadow-sm"
                aria-label={messages.account.removeFromList}
                onClick={() => toggleWishlist(product.id)}
              >
                <FaIcon icon="fa-heart" />
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <div className="flex flex-col items-center px-5 py-16 text-center">
          {tab === "wishlist" ? <WishlistEmptyArt /> : <ListEmptyArt />}
          <p className="mt-6 text-sm text-muted">
            {tab === "wishlist"
              ? messages.account.listsEmpty
              : tab === "other"
                ? messages.account.otherListsEmpty
                : messages.account.alertsEmpty}
          </p>
        </div>
      )}
    </section>
  )
}

function WishlistEmptyArt() {
  return (
    <svg
      viewBox="0 0 140 120"
      className="h-28 w-auto"
      aria-hidden="true"
    >
      <rect
        x="28"
        y="18"
        width="84"
        height="86"
        rx="6"
        fill="#f4f4f4"
        stroke="#e4e4e4"
        strokeWidth="2"
      />
      <path
        d="M28 24c8-8 20-8 28 0v80c-8-8-20-8-28 0z"
        fill="#ececec"
        stroke="#e0e0e0"
        strokeWidth="1.5"
      />
      <path
        d="M70 48c-6.5-10-22-2.5-16 12 4 9.5 16 18 16 18s12-8.5 16-18c6-14.5-9.5-22-16-12z"
        fill="#ef4056"
      />
    </svg>
  )
}

function ListEmptyArt() {
  return (
    <svg viewBox="0 0 140 120" className="h-28 w-auto" aria-hidden="true">
      <rect
        x="32"
        y="22"
        width="76"
        height="78"
        rx="6"
        fill="#f4f4f4"
        stroke="#e4e4e4"
        strokeWidth="2"
      />
      <rect x="46" y="42" width="48" height="4" rx="2" fill="#d4d4d4" />
      <rect x="46" y="54" width="36" height="4" rx="2" fill="#d4d4d4" />
      <rect x="46" y="66" width="42" height="4" rx="2" fill="#d4d4d4" />
    </svg>
  )
}
