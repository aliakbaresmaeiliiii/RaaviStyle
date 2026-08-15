export async function revalidateStorefront() {
  const base = (process.env.STOREFRONT_URL || "http://localhost:3000").replace(
    /\/$/,
    ""
  )
  const secret = process.env.REVALIDATE_SECRET

  try {
    await fetch(`${base}/api/revalidate-store`, {
      method: "POST",
      headers: secret ? { "x-revalidate-secret": secret } : {},
    })
  } catch {
    // Storefront may be down during admin-only work.
  }
}
