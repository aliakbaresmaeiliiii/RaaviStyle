export function backendOrigin() {
  return (process.env.MEDUSA_BACKEND_URL || "http://localhost:9000").replace(
    /\/$/,
    ""
  )
}

export function publicFileUrl(url?: string | null) {
  if (!url) {
    return null
  }

  const origin = backendOrigin()

  if (url.startsWith("/static/")) {
    return `${origin}${url}`
  }

  if (url.startsWith("/")) {
    return `${origin}/static${url}`
  }

  try {
    const parsed = new URL(url)
    const host = new URL(origin).host
    if (parsed.host === host && !parsed.pathname.startsWith("/static/")) {
      parsed.pathname = `/static${parsed.pathname}`
      return parsed.toString()
    }
    return url
  } catch {
    return `${origin}/static/${url}`
  }
}
