import { isValidHandle, toHandle } from "@medusajs/framework/utils"

type HandleCarrier = {
  handle?: string | null
}

export function slugifyInvalidHandle(item: HandleCarrier) {
  if (typeof item.handle !== "string" || !item.handle.trim()) {
    return
  }

  if (isValidHandle(item.handle)) {
    return
  }

  item.handle = toHandle(item.handle)
}

export function normalizeProductHandlesInBody(body: unknown) {
  if (!body || typeof body !== "object") {
    return
  }

  const payload = body as Record<string, unknown>
  slugifyInvalidHandle(payload as HandleCarrier)

  for (const key of ["create", "update", "products"] as const) {
    const list = payload[key]
    if (!Array.isArray(list)) {
      continue
    }

    for (const item of list) {
      if (item && typeof item === "object") {
        slugifyInvalidHandle(item as HandleCarrier)
      }
    }
  }
}
