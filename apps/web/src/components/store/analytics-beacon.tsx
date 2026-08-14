"use client"

import { useEffect } from "react"
import { usePathname } from "next/navigation"

const SESSION_KEY = "raavistyle.session"

function sessionId() {
  try {
    const existing = window.sessionStorage.getItem(SESSION_KEY)
    if (existing) {
      return existing
    }
    const next = crypto.randomUUID()
    window.sessionStorage.setItem(SESSION_KEY, next)
    return next
  } catch {
    return `anon_${Date.now()}`
  }
}

export function AnalyticsBeacon() {
  const pathname = usePathname()

  useEffect(() => {
    const backend =
      process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL ?? "http://localhost:9000"
    const key = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY
    if (!key) {
      return
    }

    void fetch(`${backend}/store/analytics/events`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-publishable-api-key": key,
      },
      body: JSON.stringify({
        path: pathname || "/",
        session_id: sessionId(),
      }),
      keepalive: true,
    }).catch(() => undefined)
  }, [pathname])

  return null
}
