import { colorLabel } from "@/lib/catalog"
import { toAsciiDigits } from "@/lib/phone"
import type { CartItem } from "@/lib/cart"

export const ORDER_STORAGE_KEY = "raavistyle.orders"
export const ADDRESS_STORAGE_KEY = "raavistyle.checkout-address"

export type PaymentMethodId = "cod" | "online" | "snapp" | "tara"

export type OrderLifecycle =
  | "pay"
  | "ship"
  | "receive"
  | "done"
  | "return"
  | "cancelled"

export type CheckoutAddress = {
  name: string
  phone: string
  province: string
  city: string
  postal: string
  address: string
}

export type StoredOrderItem = {
  productId: string
  title: string
  href: string
  image: string
  color: string
  colorName: string
  size: string
  quantity: number
  price: number
}

export type StoredOrder = {
  id: string
  createdAt: number
  payment: PaymentMethodId
  lifecycle?: OrderLifecycle
  paidAt?: number
  address: CheckoutAddress
  items: StoredOrderItem[]
  totals: {
    itemsPrice: number
    discount: number
    shipping: number
    payable: number
  }
}

export const provinces = [
  "تهران",
  "البرز",
  "اصفهان",
  "فارس",
  "خراسان رضوی",
  "آذربایجان شرقی",
  "آذربایجان غربی",
  "گیلان",
  "مازندران",
  "خوزستان",
  "کرمان",
  "یزد",
  "قم",
  "قزوین",
  "گلستان",
  "هرمزگان",
  "سیستان و بلوچستان",
  "کردستان",
  "کرمانشاه",
  "همدان",
  "مرکزی",
  "لرستان",
  "بوشهر",
  "زنجان",
  "اردبیل",
  "سمنان",
  "چهارمحال و بختیاری",
  "کهگیلویه و بویراحمد",
  "ایلام",
  "خراسان شمالی",
  "خراسان جنوبی",
]

export function createOrderId() {
  return `RS${Date.now().toString().slice(-8)}`
}

export function snapshotItems(items: CartItem[]): StoredOrderItem[] {
  return items.map((item) => ({
    productId: item.productId,
    title: item.product.title,
    href: item.product.href,
    image: item.product.image[0],
    color: item.color,
    colorName: colorLabel(item.color),
    size: item.size,
    quantity: item.quantity,
    price: item.product.price,
  }))
}

function isAddress(value: unknown): value is CheckoutAddress {
  if (!value || typeof value !== "object") {
    return false
  }

  const address = value as CheckoutAddress

  return (
    typeof address.name === "string" &&
    typeof address.phone === "string" &&
    typeof address.province === "string" &&
    typeof address.city === "string" &&
    typeof address.postal === "string" &&
    typeof address.address === "string"
  )
}

function isOrder(value: unknown): value is StoredOrder {
  if (!value || typeof value !== "object") {
    return false
  }

  const order = value as StoredOrder

  return (
    typeof order.id === "string" &&
    typeof order.createdAt === "number" &&
    typeof order.payment === "string" &&
    isAddress(order.address) &&
    Array.isArray(order.items)
  )
}

export function readOrders(): StoredOrder[] {
  try {
    const raw = window.localStorage.getItem(ORDER_STORAGE_KEY)

    if (!raw) {
      return []
    }

    const parsed = JSON.parse(raw) as unknown

    if (!Array.isArray(parsed)) {
      return []
    }

    return parsed.filter(isOrder)
  } catch {
    return []
  }
}

const orderListeners = new Set<() => void>()

function notifyOrderStorage() {
  orderListeners.forEach((listener) => listener())
}

export function saveOrder(order: StoredOrder) {
  const next = [order, ...readOrders()].slice(0, 20)
  window.localStorage.setItem(ORDER_STORAGE_KEY, JSON.stringify(next))
  notifyOrderStorage()
}

export function patchOrder(id: string, patch: Partial<StoredOrder>) {
  const next = readOrders().map((order) =>
    order.id === id ? { ...order, ...patch } : order,
  )
  window.localStorage.setItem(ORDER_STORAGE_KEY, JSON.stringify(next))
  notifyOrderStorage()
}

export function findOrder(id: string) {
  return readOrders().find((order) => order.id === id) ?? null
}

export function subscribeOrderStorage(onChange: () => void) {
  orderListeners.add(onChange)

  function onStorage(event: StorageEvent) {
    if (event.key === ORDER_STORAGE_KEY || event.key === null) {
      onChange()
    }
  }

  window.addEventListener("storage", onStorage)
  return () => {
    orderListeners.delete(onChange)
    window.removeEventListener("storage", onStorage)
  }
}

export function getOrderStorageSnapshot() {
  try {
    return window.localStorage.getItem(ORDER_STORAGE_KEY) ?? ""
  } catch {
    return ""
  }
}

const addressListeners = new Set<() => void>()

function notifyAddressStorage() {
  addressListeners.forEach((listener) => listener())
}

export function subscribeAddressStorage(onChange: () => void) {
  addressListeners.add(onChange)

  function onStorage(event: StorageEvent) {
    if (event.key === ADDRESS_STORAGE_KEY || event.key === null) {
      onChange()
    }
  }

  window.addEventListener("storage", onStorage)
  return () => {
    addressListeners.delete(onChange)
    window.removeEventListener("storage", onStorage)
  }
}

export function getAddressStorageSnapshot() {
  try {
    return window.localStorage.getItem(ADDRESS_STORAGE_KEY) ?? ""
  } catch {
    return ""
  }
}

export function readSavedAddress(): CheckoutAddress | null {
  try {
    const raw = window.localStorage.getItem(ADDRESS_STORAGE_KEY)

    if (!raw) {
      return null
    }

    const parsed = JSON.parse(raw) as unknown

    return isAddress(parsed) ? parsed : null
  } catch {
    return null
  }
}

export function saveAddress(address: CheckoutAddress) {
  window.localStorage.setItem(ADDRESS_STORAGE_KEY, JSON.stringify(address))
  notifyAddressStorage()
}

export function clearAddress() {
  window.localStorage.removeItem(ADDRESS_STORAGE_KEY)
  notifyAddressStorage()
}

export function isValidPostal(value: string) {
  return /^\d{10}$/.test(toAsciiDigits(value).replace(/\D/g, ""))
}
