import { cache } from "react"

export type SitePage = {
  handle: string
  title: string
  body: string
  image_url: string | null
}

function backendUrl() {
  return process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL ?? "http://localhost:9000"
}

async function fetchSitePage(handle: string): Promise<SitePage | null> {
  const key = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY
  if (!key) {
    return null
  }

  try {
    const response = await fetch(
      `${backendUrl()}/store/cms/pages/${handle}`,
      {
        headers: {
          "x-publishable-api-key": key,
        },
        next: { revalidate: 15 },
      },
    )

    if (!response.ok) {
      return null
    }

    const json = (await response.json()) as { page?: SitePage }
    return json.page ?? null
  } catch {
    return null
  }
}

export const loadSitePage = cache(fetchSitePage)
