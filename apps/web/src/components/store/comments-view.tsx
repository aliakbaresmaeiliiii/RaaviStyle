"use client"

import { useMemo, useState, useSyncExternalStore } from "react"
import Image from "next/image"
import Link from "next/link"
import { FaIcon } from "@/components/fa-icon"
import { ReviewFormDialog, StarRating } from "@/components/store/review-form"
import { messages } from "@/lib/i18n"
import {
  deleteReview,
  getFeedbackSnapshot,
  readQuestions,
  readReviews,
  subscribeFeedback,
  waitingReviewItems,
  type ReviewProduct,
} from "@/lib/reviews"
import { formatFaCalendar } from "@/lib/tracking"

type CommentTab = "waiting" | "reviews" | "questions"

const tabs: Array<{ id: CommentTab; label: string }> = [
  { id: "waiting", label: messages.account.tabWaiting },
  { id: "reviews", label: messages.account.tabMyReviews },
  { id: "questions", label: messages.account.tabMyQuestions },
]

export function CommentsView({ defaultName = "" }: { defaultName?: string }) {
  const [tab, setTab] = useState<CommentTab>("waiting")
  const [target, setTarget] = useState<ReviewProduct | null>(null)
  const hydrated = useSyncExternalStore(
    () => () => undefined,
    () => true,
    () => false,
  )
  const raw = useSyncExternalStore(
    subscribeFeedback,
    getFeedbackSnapshot,
    () => "",
  )
  const reviews = useMemo(() => (raw ? readReviews() : []), [raw])
  const questions = useMemo(() => (raw ? readQuestions() : []), [raw])
  const waiting = useMemo(
    () => (hydrated ? waitingReviewItems() : []),
    [hydrated, raw],
  )

  return (
    <section className="overflow-hidden rounded-xl bg-surface shadow-card">
      <header className="border-b border-line px-5">
        <h1 className="-mb-px w-fit border-b-[3px] border-sale py-3.5 text-[15px] font-medium">
          {messages.account.comments}
        </h1>
      </header>

      <div
        className="no-scrollbar flex gap-1 overflow-x-auto border-b border-line px-2 sm:px-4"
        role="tablist"
        aria-label={messages.account.comments}
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

      {!hydrated ? (
        <p className="px-5 py-16 text-center text-sm text-muted">
          {messages.shop.loading}
        </p>
      ) : tab === "waiting" ? (
        waiting.length ? (
          <ul className="divide-y divide-line">
            {waiting.map((item) => (
              <li
                key={item.productId}
                className="flex items-center gap-3 p-4 sm:p-5"
              >
                <Link
                  href={item.href}
                  className="relative size-16 shrink-0 overflow-hidden rounded-lg bg-soft"
                >
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    sizes="64px"
                    className="object-cover"
                  />
                </Link>
                <div className="min-w-0 flex-1">
                  <Link href={item.href} className="line-clamp-2 text-sm">
                    {item.title}
                  </Link>
                  <p className="mt-1 text-xs text-muted">
                    {item.colorName} | {item.size}
                  </p>
                </div>
                <button
                  type="button"
                  className="inline-flex h-10 shrink-0 items-center rounded-lg border border-sale px-3 text-sm text-sale hover:bg-sale/5"
                  onClick={() =>
                    setTarget({
                      id: item.productId,
                      title: item.title,
                      href: item.href,
                      image: item.image,
                    })
                  }
                >
                  {messages.shop.writeReview}
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <EmptyState text={messages.account.waitingEmpty} />
        )
      ) : tab === "reviews" ? (
        reviews.length ? (
          <ul className="space-y-4 p-4 sm:p-5">
            {reviews.map((item) => (
              <li key={item.id} className="rounded-xl border border-line p-4">
                <div className="flex gap-3">
                  <Link
                    href={item.productHref}
                    className="relative size-16 shrink-0 overflow-hidden rounded-lg bg-soft"
                  >
                    <Image
                      src={item.productImage}
                      alt={item.productTitle}
                      fill
                      sizes="64px"
                      className="object-cover"
                    />
                  </Link>
                  <div className="min-w-0 flex-1">
                    <Link href={item.productHref} className="text-sm">
                      {item.productTitle}
                    </Link>
                    <div className="mt-1 flex flex-wrap items-center gap-2">
                      <StarRating value={item.rating} size="text-xs" />
                      {item.buyer ? (
                        <span className="text-[11px] text-success">
                          {messages.shop.buyerBadge}
                        </span>
                      ) : null}
                    </div>
                    <p className="mt-2 text-sm leading-7">{item.text}</p>
                    <p className="mt-2 text-xs text-muted">
                      {formatFaCalendar(item.createdAt)}
                    </p>
                  </div>
                  <div className="flex shrink-0 flex-col gap-1">
                    <button
                      type="button"
                      className="flex size-9 items-center justify-center rounded-lg text-muted hover:bg-soft"
                      aria-label={messages.shop.editReview}
                      onClick={() =>
                        setTarget({
                          id: item.productId,
                          title: item.productTitle,
                          href: item.productHref,
                          image: item.productImage,
                        })
                      }
                    >
                      <FaIcon icon="fa-pen" className="text-xs" />
                    </button>
                    <button
                      type="button"
                      className="flex size-9 items-center justify-center rounded-lg text-muted hover:bg-soft hover:text-sale"
                      aria-label={messages.account.deleteReview}
                      onClick={() => deleteReview(item.id)}
                    >
                      <FaIcon icon="fa-trash-can" className="text-xs" />
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <EmptyState text={messages.account.myReviewsEmpty} />
        )
      ) : questions.length ? (
        <ul className="space-y-4 p-4 sm:p-5">
          {questions.map((item) => (
            <li key={item.id} className="rounded-xl border border-line p-4">
              <Link href={item.productHref} className="text-sm font-medium">
                {item.productTitle}
              </Link>
              <p className="mt-2 text-sm leading-7">{item.text}</p>
              <p className="mt-2 text-xs text-muted">
                {formatFaCalendar(item.createdAt)}
              </p>
            </li>
          ))}
        </ul>
      ) : (
        <EmptyState text={messages.account.myQuestionsEmpty} />
      )}

      {target ? (
        <ReviewFormDialog
          product={target}
          defaultName={defaultName}
          open
          onClose={() => setTarget(null)}
        />
      ) : null}
    </section>
  )
}

function EmptyState({ text }: { text: string }) {
  return (
    <div className="flex flex-col items-center px-5 py-16 text-center">
      <span className="flex size-16 items-center justify-center rounded-full bg-soft text-mocha">
        <FaIcon icon="fa-comment" className="text-xl" />
      </span>
      <p className="mt-5 text-sm text-muted">{text}</p>
    </div>
  )
}
