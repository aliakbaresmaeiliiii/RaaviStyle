import { readOrders, type StoredOrderItem } from "@/lib/orders"

export const FEEDBACK_STORAGE_KEY = "raavistyle.feedback"

export type Review = {
  id: string
  productId: string
  productTitle: string
  productHref: string
  productImage: string
  name: string
  rating: number
  text: string
  buyer: boolean
  createdAt: number
}

export type Question = {
  id: string
  productId: string
  productTitle: string
  productHref: string
  productImage: string
  name: string
  text: string
  createdAt: number
}

export type ReviewProduct = {
  id: string
  title: string
  href: string
  image: string
}

type FeedbackStore = {
  reviews: Review[]
  questions: Question[]
}

const listeners = new Set<() => void>()

function notify() {
  listeners.forEach((listener) => listener())
}

function emptyStore(): FeedbackStore {
  return { reviews: [], questions: [] }
}

function isReview(value: unknown): value is Review {
  if (!value || typeof value !== "object") {
    return false
  }

  const item = value as Review
  return (
    typeof item.id === "string" &&
    typeof item.productId === "string" &&
    typeof item.name === "string" &&
    typeof item.rating === "number" &&
    typeof item.text === "string" &&
    typeof item.createdAt === "number"
  )
}

function isQuestion(value: unknown): value is Question {
  if (!value || typeof value !== "object") {
    return false
  }

  const item = value as Question
  return (
    typeof item.id === "string" &&
    typeof item.productId === "string" &&
    typeof item.name === "string" &&
    typeof item.text === "string" &&
    typeof item.createdAt === "number"
  )
}

function readStore(): FeedbackStore {
  try {
    const raw = window.localStorage.getItem(FEEDBACK_STORAGE_KEY)

    if (!raw) {
      return emptyStore()
    }

    const parsed = JSON.parse(raw) as Partial<FeedbackStore>
    return {
      reviews: Array.isArray(parsed.reviews)
        ? parsed.reviews.filter(isReview)
        : [],
      questions: Array.isArray(parsed.questions)
        ? parsed.questions.filter(isQuestion)
        : [],
    }
  } catch {
    return emptyStore()
  }
}

function writeStore(store: FeedbackStore) {
  window.localStorage.setItem(FEEDBACK_STORAGE_KEY, JSON.stringify(store))
  notify()
}

export function subscribeFeedback(onChange: () => void) {
  listeners.add(onChange)

  function onStorage(event: StorageEvent) {
    if (event.key === FEEDBACK_STORAGE_KEY || event.key === null) {
      onChange()
    }
  }

  window.addEventListener("storage", onStorage)
  return () => {
    listeners.delete(onChange)
    window.removeEventListener("storage", onStorage)
  }
}

export function getFeedbackSnapshot() {
  try {
    return window.localStorage.getItem(FEEDBACK_STORAGE_KEY) ?? ""
  } catch {
    return ""
  }
}

export function readReviews() {
  return readStore().reviews
}

export function readQuestions() {
  return readStore().questions
}

export function reviewsForProduct(productId: string) {
  return readReviews().filter((item) => item.productId === productId)
}

export function questionsForProduct(productId: string) {
  return readQuestions().filter((item) => item.productId === productId)
}

export function findReviewForProduct(productId: string) {
  return readReviews().find((item) => item.productId === productId) ?? null
}

export function hasPurchased(productId: string) {
  return readOrders().some((order) =>
    order.items.some((item) => item.productId === productId),
  )
}

export function waitingReviewItems(): StoredOrderItem[] {
  const reviewed = new Set(readReviews().map((item) => item.productId))
  const seen = new Set<string>()
  const items: StoredOrderItem[] = []

  for (const order of readOrders()) {
    for (const item of order.items) {
      if (reviewed.has(item.productId) || seen.has(item.productId)) {
        continue
      }

      seen.add(item.productId)
      items.push(item)
    }
  }

  return items
}

export function saveReview(
  product: ReviewProduct,
  input: { name: string; rating: number; text: string },
) {
  const store = readStore()
  const existing = store.reviews.find((item) => item.productId === product.id)
  const review: Review = {
    id: existing?.id ?? `RV${Date.now().toString(36)}`,
    productId: product.id,
    productTitle: product.title,
    productHref: product.href,
    productImage: product.image,
    name: input.name.trim(),
    rating: input.rating,
    text: input.text.trim(),
    buyer: hasPurchased(product.id),
    createdAt: existing?.createdAt ?? Date.now(),
  }

  writeStore({
    ...store,
    reviews: [review, ...store.reviews.filter((item) => item.id !== review.id)],
  })

  return review
}

export function deleteReview(id: string) {
  const store = readStore()
  writeStore({
    ...store,
    reviews: store.reviews.filter((item) => item.id !== id),
  })
}

export function saveQuestion(
  product: ReviewProduct,
  input: { name: string; text: string },
) {
  const question: Question = {
    id: `QS${Date.now().toString(36)}`,
    productId: product.id,
    productTitle: product.title,
    productHref: product.href,
    productImage: product.image,
    name: input.name.trim() || "کاربر",
    text: input.text.trim(),
    createdAt: Date.now(),
  }

  const store = readStore()
  writeStore({
    ...store,
    questions: [question, ...store.questions],
  })

  return question
}

export function averageRating(reviews: Array<{ rating: number }>) {
  if (!reviews.length) {
    return 0
  }

  return (
    reviews.reduce((sum, item) => sum + item.rating, 0) / reviews.length
  )
}
