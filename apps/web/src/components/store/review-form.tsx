"use client"

import { useEffect, useId, useState, type FormEvent } from "react"
import { FaIcon } from "@/components/fa-icon"
import { messages } from "@/lib/i18n"
import {
  findReviewForProduct,
  saveReview,
  type ReviewProduct,
} from "@/lib/reviews"

export function StarRating({
  value,
  onChange,
  size = "text-lg",
}: {
  value: number
  onChange?: (value: number) => void
  size?: string
}) {
  return (
    <div className="inline-flex gap-1" role={onChange ? "radiogroup" : undefined}>
      {[1, 2, 3, 4, 5].map((star) => {
        const filled = star <= value
        const interactive = Boolean(onChange)

        return (
          <button
            key={star}
            type="button"
            disabled={!interactive}
            aria-label={`${star.toLocaleString("fa-IR")} ${messages.shop.starUnit}`}
            className={`${size} ${
              filled ? "text-bronze" : "text-line"
            } ${interactive ? "hover:text-bronze" : "cursor-default disabled:opacity-100"}`}
            onClick={() => onChange?.(star)}
          >
            <FaIcon icon="fa-star" />
          </button>
        )
      })}
    </div>
  )
}

export function ReviewFormDialog({
  product,
  defaultName = "",
  open,
  onClose,
}: {
  product: ReviewProduct
  defaultName?: string
  open: boolean
  onClose: () => void
}) {
  const titleId = useId()
  const existing = open ? findReviewForProduct(product.id) : null
  const [name, setName] = useState("")
  const [rating, setRating] = useState(0)
  const [text, setText] = useState("")
  const [errors, setErrors] = useState<{
    name?: string
    rating?: string
    text?: string
  }>({})
  const [wasOpen, setWasOpen] = useState(false)

  if (open && !wasOpen) {
    setWasOpen(true)
    setName(existing?.name || defaultName)
    setRating(existing?.rating ?? 0)
    setText(existing?.text ?? "")
    setErrors({})
  } else if (!open && wasOpen) {
    setWasOpen(false)
  }

  useEffect(() => {
    if (!open) {
      return
    }

    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose()
      }
    }

    document.addEventListener("keydown", onKey)
    return () => document.removeEventListener("keydown", onKey)
  }, [open, onClose])

  function onSubmit(event: FormEvent) {
    event.preventDefault()
    const next: typeof errors = {}
    if (name.trim().length < 2) {
      next.name = messages.pay.required
    }
    if (rating < 1) {
      next.rating = messages.shop.ratingRequired
    }
    if (text.trim().length < 8) {
      next.text = messages.shop.reviewRequired
    }

    setErrors(next)

    if (Object.keys(next).length) {
      return
    }

    saveReview(product, { name, rating, text })
    onClose()
  }

  if (!open) {
    return null
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-espresso/40 sm:items-center sm:p-4"
      onClick={onClose}
    >
      <form
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        onSubmit={onSubmit}
        onClick={(event) => event.stopPropagation()}
        className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-t-2xl bg-surface p-5 shadow-lg sm:rounded-2xl"
      >
        <div className="mb-5 flex items-start justify-between gap-3">
          <div>
            <h2 id={titleId} className="text-base font-medium">
              {existing
                ? messages.shop.editReview
                : messages.shop.writeReview}
            </h2>
            <p className="mt-1 text-sm text-muted">{product.title}</p>
          </div>
          <button
            type="button"
            className="flex size-9 shrink-0 items-center justify-center rounded-lg text-muted hover:bg-soft"
            aria-label={messages.account.cancel}
            onClick={onClose}
          >
            <FaIcon icon="fa-xmark" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <p className="mb-2 text-sm text-muted">{messages.shop.ratingLabel}</p>
            <StarRating value={rating} onChange={setRating} size="text-xl" />
            {errors.rating ? (
              <p className="mt-1.5 text-xs text-error">{errors.rating}</p>
            ) : null}
          </div>
          <label className="block">
            <span className="mb-2 block text-sm text-muted">
              {messages.shop.reviewName}
            </span>
            <input
              value={name}
              onChange={(event) => setName(event.target.value)}
              autoComplete="name"
              className="h-12 w-full rounded-xl bg-page px-4 text-sm outline-none ring-1 ring-line focus:ring-2 focus:ring-mocha"
            />
            {errors.name ? (
              <span className="mt-1.5 block text-xs text-error">{errors.name}</span>
            ) : null}
          </label>
          <label className="block">
            <span className="mb-2 block text-sm text-muted">
              {messages.shop.reviewBody}
            </span>
            <textarea
              value={text}
              onChange={(event) => setText(event.target.value)}
              rows={5}
              placeholder={messages.shop.reviewPlaceholder}
              className="w-full rounded-xl bg-page px-4 py-3 text-sm outline-none ring-1 ring-line focus:ring-2 focus:ring-mocha"
            />
            {errors.text ? (
              <span className="mt-1.5 block text-xs text-error">{errors.text}</span>
            ) : null}
          </label>
        </div>

        <div className="mt-6 flex flex-wrap justify-end gap-2">
          <button
            type="button"
            className="h-11 rounded-lg border border-line px-5 text-sm hover:border-mocha"
            onClick={onClose}
          >
            {messages.account.cancel}
          </button>
          <button
            type="submit"
            className="h-11 rounded-lg bg-sale px-5 text-sm text-white"
          >
            {messages.shop.submitReview}
          </button>
        </div>
      </form>
    </div>
  )
}
