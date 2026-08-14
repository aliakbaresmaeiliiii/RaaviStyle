import { products, type Product } from "@/lib/catalog"

export type CartLine = {
  productId: string
  color: string
  size: string
  quantity: number
}

export type CartItem = CartLine & {
  product: Product
}

export const CART_STORAGE_KEY = "raavistyle.cart"
export const CART_EVENT = "raavistyle-cart"
export const FREE_SHIPPING_MIN = 2_000_000
export const SHIPPING_FEE = 49_000
export const MAX_QTY = 10

export function lineKey(line: Pick<CartLine, "productId" | "color" | "size">) {
  return `${line.productId}::${line.color}::${line.size}`
}

function isCartLine(value: unknown): value is CartLine {
  if (!value || typeof value !== "object") {
    return false
  }

  const line = value as CartLine

  return (
    typeof line.productId === "string" &&
    typeof line.color === "string" &&
    typeof line.size === "string" &&
    Number.isInteger(line.quantity) &&
    line.quantity > 0
  )
}

export function parseCart(raw: string): CartLine[] {
  try {
    const parsed = JSON.parse(raw) as unknown

    if (!Array.isArray(parsed)) {
      return []
    }

    return parsed.filter(isCartLine)
  } catch {
    return []
  }
}

export function getCartSnapshot() {
  try {
    return window.localStorage.getItem(CART_STORAGE_KEY) ?? "[]"
  } catch {
    return "[]"
  }
}

export function getCartServerSnapshot() {
  return "[]"
}

export function subscribeCart(onChange: () => void) {
  function onStorage(event: StorageEvent) {
    if (event.key === CART_STORAGE_KEY || event.key === null) {
      onChange()
    }
  }

  window.addEventListener("storage", onStorage)
  window.addEventListener(CART_EVENT, onChange)

  return () => {
    window.removeEventListener("storage", onStorage)
    window.removeEventListener(CART_EVENT, onChange)
  }
}

export function readCart(): CartLine[] {
  return parseCart(getCartSnapshot())
}

export function writeCart(lines: CartLine[]) {
  try {
    window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(lines))
  } catch {
    // Ignore quota / private-mode failures; in-memory UI still updates via the event.
  }
  window.dispatchEvent(new Event(CART_EVENT))
}

export function resolveCart(
  lines: CartLine[],
  catalog: Product[] = products,
): CartItem[] {
  return lines.flatMap((line) => {
    const product = catalog.find((item) => item.id === line.productId)

    if (!product) {
      return []
    }

    return [{ ...line, product }]
  })
}

export function cartCount(lines: CartLine[]) {
  return lines.reduce((sum, line) => sum + line.quantity, 0)
}

export function upsertLine(
  lines: CartLine[],
  input: Pick<CartLine, "productId" | "color" | "size"> & { quantity?: number },
) {
  const quantity = Math.min(Math.max(input.quantity ?? 1, 1), MAX_QTY)
  const key = lineKey(input)
  const existing = lines.find((line) => lineKey(line) === key)

  if (!existing) {
    return [...lines, { ...input, quantity }]
  }

  return lines.map((line) =>
    lineKey(line) === key
      ? { ...line, quantity: Math.min(line.quantity + quantity, MAX_QTY) }
      : line,
  )
}

export function setLineQuantity(lines: CartLine[], key: string, quantity: number) {
  if (quantity <= 0) {
    return lines.filter((line) => lineKey(line) !== key)
  }

  return lines.map((line) =>
    lineKey(line) === key
      ? { ...line, quantity: Math.min(quantity, MAX_QTY) }
      : line,
  )
}

export function removeLine(lines: CartLine[], key: string) {
  return lines.filter((line) => lineKey(line) !== key)
}

export function cartTotals(items: CartItem[]) {
  const itemsPrice = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0,
  )
  const compareAt = items.reduce(
    (sum, item) =>
      sum + (item.product.compareAt ?? item.product.price) * item.quantity,
    0,
  )
  const discount = Math.max(0, compareAt - itemsPrice)
  const remainingForFreeShipping = Math.max(0, FREE_SHIPPING_MIN - itemsPrice)

  return {
    itemsPrice,
    compareAt,
    discount,
    remainingForFreeShipping,
    freeShipping: remainingForFreeShipping === 0 && itemsPrice > 0,
    payable: itemsPrice,
  }
}

export function checkoutTotals(items: CartItem[]) {
  const base = cartTotals(items)
  const shipping = base.freeShipping ? 0 : SHIPPING_FEE

  return {
    ...base,
    shipping,
    payable: base.itemsPrice + shipping,
  }
}
