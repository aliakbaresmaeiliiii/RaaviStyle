import { normalizePhone, toAsciiDigits, toPersianDigits } from "@/lib/phone"
import type { StoredOrder } from "@/lib/orders"

export const TRACK_STAGES = [
  { id: "placed", after: 0 },
  { id: "packed", after: 20 * 60 * 1000 },
  { id: "handover", after: 4 * 60 * 60 * 1000 },
  { id: "transit", after: 10 * 60 * 60 * 1000 },
  { id: "out", after: 2 * 24 * 60 * 60 * 1000 },
  { id: "delivered", after: 4 * 24 * 60 * 60 * 1000 },
] as const

export type TrackStageId = (typeof TRACK_STAGES)[number]["id"]
export type TrackTab = "all" | "ship" | "receive" | "done"
export type HistoryTab = "current" | "delivered" | "returned" | "cancelled"
export type PurchaseTab =
  | "all"
  | "pay"
  | "ship"
  | "receive"
  | "done"
  | "return"
  | "cancelled"

const ORDER_ID_PATTERN = /^RS\d{8}$/
const DAY = 24 * 60 * 60 * 1000

const NEXT_STAGE: Record<TrackStageId, TrackStageId | null> = {
  placed: "packed",
  packed: "handover",
  handover: "transit",
  transit: "out",
  out: "delivered",
  delivered: null,
}

export function normalizeOrderId(value: string) {
  const compact = toAsciiDigits(value)
    .trim()
    .toUpperCase()
    .replace(/[\s-]/g, "")

  return ORDER_ID_PATTERN.test(compact) ? compact : null
}

export function trackingNumber(orderId: string) {
  const digits = toAsciiDigits(orderId).replace(/\D/g, "").slice(-8)
  return `RV-${digits}`
}

export function currentStage(
  createdAt: number,
  now = Date.now(),
): TrackStageId {
  const elapsed = Math.max(0, now - createdAt)
  let stage: TrackStageId = "placed"

  for (const item of TRACK_STAGES) {
    if (elapsed >= item.after) {
      stage = item.id
    }
  }

  return stage
}

export function orderClock(order: StoredOrder) {
  return order.paidAt ?? order.createdAt
}

export function orderStage(order: StoredOrder, now = Date.now()): TrackStageId {
  if (order.lifecycle === "pay") {
    return "placed"
  }

  return currentStage(orderClock(order), now)
}

export function purchaseTab(
  order: StoredOrder,
  now = Date.now(),
): Exclude<PurchaseTab, "all"> {
  if (order.lifecycle === "cancelled") {
    return "cancelled"
  }

  if (order.lifecycle === "return") {
    return "return"
  }

  if (order.lifecycle === "done") {
    return "done"
  }

  if (order.lifecycle === "pay") {
    return "pay"
  }

  const stage = orderStage(order, now)

  if (order.lifecycle === "receive") {
    return "receive"
  }

  if (stage === "delivered") {
    return "done"
  }

  if (stage === "placed" || stage === "packed") {
    return "ship"
  }

  return "receive"
}

export function stageTab(stage: TrackStageId): Exclude<TrackTab, "all"> {
  if (stage === "placed" || stage === "packed") {
    return "ship"
  }

  if (stage === "delivered") {
    return "done"
  }

  return "receive"
}

export function historyTab(stage: TrackStageId): HistoryTab {
  if (stage === "delivered") {
    return "delivered"
  }

  return "current"
}

export function nextStage(stage: TrackStageId): TrackStageId | null {
  return NEXT_STAGE[stage]
}

export function deliveryAt(createdAt: number) {
  return createdAt + 4 * DAY
}

export function occurredEvents(createdAt: number, now = Date.now()) {
  return TRACK_STAGES.filter((stage) => now - createdAt >= stage.after)
    .map((stage) => ({
      id: stage.id,
      at: createdAt + stage.after,
    }))
    .reverse()
}

export function etaRange(createdAt: number) {
  return {
    from: createdAt + 3 * DAY,
    to: createdAt + 5 * DAY,
  }
}

export function formatFaDate(value: number) {
  return new Intl.DateTimeFormat("fa-IR", {
    day: "numeric",
    month: "long",
  }).format(new Date(value))
}

export function formatFaCalendar(value: number) {
  return new Intl.DateTimeFormat("fa-IR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(value))
}

export function formatFaFullDate(value: number) {
  return new Intl.DateTimeFormat("fa-IR", {
    weekday: "long",
    day: "numeric",
    month: "long",
  }).format(new Date(value))
}

export function formatFaDateTime(value: number) {
  return new Intl.DateTimeFormat("fa-IR", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value))
}

export function maskPhone(phone: string) {
  const normalized = normalizePhone(phone) ?? phone

  if (normalized.startsWith("+98") && normalized.length === 13) {
    const local = `0${normalized.slice(3)}`
    return toPersianDigits(
      `${local.slice(0, 4)} *** **${local.slice(9)}`,
    )
  }

  const digits = toAsciiDigits(normalized).replace(/\D/g, "")

  if (digits.length < 6) {
    return "***"
  }

  return toPersianDigits(
    `${digits.slice(0, 3)} *** ${digits.slice(-2)}`,
  )
}

export function maskStreet(address: string) {
  if (!address.trim()) {
    return "********"
  }

  return "********"
}

export function maskPostal(postal: string) {
  const digits = toAsciiDigits(postal).replace(/\D/g, "")

  if (digits.length < 4) {
    return "******"
  }

  return toPersianDigits(`******${digits.slice(-4)}`)
}

export function orderItemCount(order: StoredOrder) {
  return order.items.reduce((sum, item) => sum + item.quantity, 0)
}
