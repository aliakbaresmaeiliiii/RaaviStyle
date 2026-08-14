"use client"

import { useCallback, useEffect, useId, useState } from "react"
import { usePathname } from "next/navigation"
import { FaIcon } from "@/components/fa-icon"
import { messages } from "@/lib/i18n"
import {
  sizeChart,
  sizeFitVotes,
  type Product,
} from "@/lib/catalog"

export const SIZE_GUIDE_HASH = "size-guide"

type GuideTab = "guide" | "fit"

const fitLabels = {
  muchLarger: messages.shop.fitMuchLarger,
  bitLarger: messages.shop.fitBitLarger,
  expected: messages.shop.fitExpected,
  bitSmaller: messages.shop.fitBitSmaller,
  muchSmaller: messages.shop.fitMuchSmaller,
} as const

function hashIsSizeGuide() {
  return window.location.hash.replace(/^#/, "") === SIZE_GUIDE_HASH
}

export function SizeGuideDialog({
  product,
  size,
}: {
  product: Product
  size: string
}) {
  const pathname = usePathname()
  const titleId = useId()
  const [open, setOpen] = useState(false)
  const [tab, setTab] = useState<GuideTab>("guide")
  const rows = sizeChart(product)
  const votes = sizeFitVotes(product)
  const totalVotes = votes.reduce((sum, item) => sum + item.count, 0)

  const close = useCallback(() => {
    setOpen(false)
    window.history.replaceState(
      null,
      "",
      `${pathname}${window.location.search}`,
    )
  }, [pathname])

  useEffect(() => {
    function sync() {
      const next = hashIsSizeGuide()
      setOpen(next)
      if (next) {
        setTab("guide")
      }
    }

    sync()
    window.addEventListener("hashchange", sync)
    window.addEventListener("popstate", sync)
    return () => {
      window.removeEventListener("hashchange", sync)
      window.removeEventListener("popstate", sync)
    }
  }, [])

  useEffect(() => {
    if (!open) {
      return
    }

    const previous = document.body.style.overflow
    document.body.style.overflow = "hidden"

    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") {
        close()
      }
    }

    document.addEventListener("keydown", onKey)
    return () => {
      document.body.style.overflow = previous
      document.removeEventListener("keydown", onKey)
    }
  }, [open, close])

  if (!open) {
    return null
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-espresso/40 sm:items-center sm:p-4"
      onClick={close}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        onClick={(event) => event.stopPropagation()}
        className="flex max-h-[92vh] w-full max-w-lg flex-col overflow-hidden rounded-t-2xl bg-surface shadow-lg sm:rounded-2xl"
      >
        <header className="flex items-center justify-between gap-3 px-4 pt-4">
          <h2 id={titleId} className="text-sm font-medium">
            {messages.shop.sizeGuideHeading(size)}
          </h2>
          <button
            type="button"
            className="flex size-9 items-center justify-center rounded-lg text-muted hover:bg-soft"
            aria-label={messages.shop.close}
            onClick={close}
          >
            <FaIcon icon="fa-xmark" />
          </button>
        </header>

        <div
          className="mt-2 flex border-b border-line px-4"
          role="tablist"
          aria-label={messages.shop.sizeGuide}
        >
          {(
            [
              ["guide", messages.shop.sizeGuideTab],
              ["fit", messages.shop.buyerFitTab],
            ] as Array<[GuideTab, string]>
          ).map(([id, label]) => {
            const selected = tab === id

            return (
              <button
                key={id}
                type="button"
                role="tab"
                aria-selected={selected}
                onClick={() => setTab(id)}
                className={`-mb-px border-b-2 px-3 py-2.5 text-sm ${
                  selected
                    ? "border-espresso text-ink"
                    : "border-transparent text-muted"
                }`}
              >
                {label}
              </button>
            )
          })}
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4">
          {tab === "guide" ? (
            <div>
              <div className="overflow-hidden rounded-xl bg-soft">
                <p className="bg-cocoa px-4 py-2 text-center text-sm text-white">
                  {messages.shop.pantsDiagram}
                </p>
                <PantsDiagram />
                <div className="flex flex-wrap justify-center gap-2 px-3 pb-4">
                  <LegendPill letter="A" label={messages.shop.measureLength} />
                  <LegendPill letter="B" label={messages.shop.measureWaist} />
                  <LegendPill letter="C" label={messages.shop.measureHip} />
                </div>
              </div>

              <div className="mt-4 overflow-x-auto">
                <table className="w-full min-w-xl text-center text-xs">
                  <thead>
                    <tr className="bg-soft text-muted">
                      <th className="px-2 py-2.5 font-medium">
                        {messages.shop.colSize}
                      </th>
                      <th className="px-2 py-2.5 font-medium">
                        {messages.shop.colWaist}
                      </th>
                      <th className="px-2 py-2.5 font-medium">
                        {messages.shop.colHip}
                      </th>
                      <th className="px-2 py-2.5 font-medium">
                        {messages.shop.colLength}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((row) => {
                      const active = row.size === size

                      return (
                        <tr
                          key={row.size}
                          className={active ? "bg-shop/10 font-medium" : ""}
                        >
                          <td className="px-2 py-2.5">{row.size}</td>
                          <td className="px-2 py-2.5">{row.waist}</td>
                          <td className="px-2 py-2.5">{row.hip}</td>
                          <td className="px-2 py-2.5">{row.length}</td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div>
              <p className="text-center text-sm leading-7">
                {messages.shop.fitQuestion}
              </p>
              <ul className="mt-5 space-y-3">
                {votes.map((item) => {
                  const percent = totalVotes
                    ? Math.round((item.count / totalVotes) * 100)
                    : 0

                  return (
                    <li
                      key={item.id}
                      className="grid grid-cols-[7.5rem_minmax(0,1fr)_2rem] items-center gap-3 text-sm"
                    >
                      <span>{fitLabels[item.id]}</span>
                      <span className="h-2.5 overflow-hidden rounded-full bg-line">
                        <span
                          className="block h-full rounded-full bg-shop"
                          style={{ width: `${Math.max(percent, 2)}%` }}
                        />
                      </span>
                      <span className="text-left text-muted" dir="ltr">
                        {item.count.toLocaleString("fa-IR")}
                      </span>
                    </li>
                  )
                })}
              </ul>
            </div>
          )}
        </div>

        <div className="p-4">
          <button
            type="button"
            onClick={close}
            className="flex h-12 w-full items-center justify-center rounded-full bg-soft text-sm font-medium"
          >
            {messages.shop.gotIt}
          </button>
        </div>
      </div>
    </div>
  )
}

function LegendPill({ letter, label }: { letter: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-surface px-3 py-1 text-xs ring-1 ring-line">
      <span className="flex size-5 items-center justify-center rounded-full bg-espresso text-[10px] text-white">
        {letter}
      </span>
      {label}
    </span>
  )
}

function PantsDiagram() {
  return (
    <svg
      viewBox="0 0 260 220"
      className="mx-auto mt-2 block h-48 w-auto text-cocoa"
      aria-hidden="true"
    >
      <path
        d="M88 28h84l18 168h-46l-14-92-14 92H70z"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
      />
      <path
        d="M88 28c12 10 28 12 42 12s30-2 42-12"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <ellipse
        cx="130"
        cy="42"
        rx="44"
        ry="10"
        fill="none"
        stroke="currentColor"
        strokeDasharray="3 3"
      />
      <ellipse
        cx="130"
        cy="78"
        rx="50"
        ry="12"
        fill="none"
        stroke="currentColor"
        strokeDasharray="3 3"
      />
      <line
        x1="54"
        y1="28"
        x2="54"
        y2="196"
        stroke="currentColor"
        strokeDasharray="3 3"
      />
      <polygon points="54,24 50,32 58,32" fill="currentColor" />
      <polygon points="54,200 50,192 58,192" fill="currentColor" />
      <circle cx="54" cy="112" r="10" fill="var(--surface)" stroke="currentColor" />
      <text x="54" y="116" textAnchor="middle" fontSize="11" fill="currentColor">
        A
      </text>
      <circle cx="178" cy="42" r="10" fill="var(--surface)" stroke="currentColor" />
      <text x="178" y="46" textAnchor="middle" fontSize="11" fill="currentColor">
        B
      </text>
      <circle cx="186" cy="78" r="10" fill="var(--surface)" stroke="currentColor" />
      <text x="186" y="82" textAnchor="middle" fontSize="11" fill="currentColor">
        C
      </text>
    </svg>
  )
}
