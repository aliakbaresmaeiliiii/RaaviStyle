export const WISHLIST_STORAGE_KEY = "raavistyle.wishlist"
export const WISHLIST_NOTIFY_KEY = "raavistyle.wishlist-notify"

const listeners = new Set<() => void>()

function notify() {
  listeners.forEach((listener) => listener())
}

function onStorage(event: StorageEvent, key: string, onChange: () => void) {
  if (event.key === key || event.key === null) {
    onChange()
  }
}

export function subscribeWishlist(onChange: () => void) {
  listeners.add(onChange)
  const handler = (event: StorageEvent) => onStorage(event, WISHLIST_STORAGE_KEY, onChange)
  window.addEventListener("storage", handler)
  return () => {
    listeners.delete(onChange)
    window.removeEventListener("storage", handler)
  }
}

export function getWishlistSnapshot() {
  try {
    return window.localStorage.getItem(WISHLIST_STORAGE_KEY) ?? ""
  } catch {
    return ""
  }
}

export function readWishlist(): string[] {
  try {
    const raw = window.localStorage.getItem(WISHLIST_STORAGE_KEY)

    if (!raw) {
      return []
    }

    const parsed = JSON.parse(raw) as unknown

    if (!Array.isArray(parsed)) {
      return []
    }

    return parsed.filter((id): id is string => typeof id === "string")
  } catch {
    return []
  }
}

export function isWishlisted(productId: string) {
  return readWishlist().includes(productId)
}

export function toggleWishlist(productId: string) {
  const current = readWishlist()
  const next = current.includes(productId)
    ? current.filter((id) => id !== productId)
    : [productId, ...current]

  window.localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(next))
  notify()
  return next.includes(productId)
}

const notifyListeners = new Set<() => void>()

export function subscribeWishlistNotify(onChange: () => void) {
  notifyListeners.add(onChange)
  const handler = (event: StorageEvent) =>
    onStorage(event, WISHLIST_NOTIFY_KEY, onChange)
  window.addEventListener("storage", handler)
  return () => {
    notifyListeners.delete(onChange)
    window.removeEventListener("storage", handler)
  }
}

export function getWishlistNotifySnapshot() {
  try {
    return window.localStorage.getItem(WISHLIST_NOTIFY_KEY) ?? "1"
  } catch {
    return "1"
  }
}

export function readWishlistNotify() {
  return getWishlistNotifySnapshot() !== "0"
}

export function setWishlistNotify(enabled: boolean) {
  window.localStorage.setItem(WISHLIST_NOTIFY_KEY, enabled ? "1" : "0")
  notifyListeners.forEach((listener) => listener())
}
