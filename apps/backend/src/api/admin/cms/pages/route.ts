import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { revalidateStorefront } from "../../../../utils/revalidate-storefront"
import {
  listSitePagesWorkflow,
  upsertSitePageWorkflow,
} from "../../../../workflows/upsert-site-page"

type UpsertPageBody = {
  handle?: string
  title?: string
  body?: string
  image_url?: string | null
  images?: string[] | null
}

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const { result } = await listSitePagesWorkflow(req.scope).run()
  res.json({ pages: result })
}

export async function POST(
  req: MedusaRequest<UpsertPageBody>,
  res: MedusaResponse
) {
  const body = (req.body || {}) as UpsertPageBody
  const handle = body.handle?.trim()
  const title = body.title?.trim()

  if (!handle || !title) {
    res.status(400).json({
      message: "handle and title are required",
    })
    return
  }

  const { result } = await upsertSitePageWorkflow(req.scope).run({
    input: {
      handle,
      title,
      body: body.body ?? "",
      image_url: body.image_url ?? null,
      images: Array.isArray(body.images) ? body.images : undefined,
    },
  })

  await revalidateStorefront()
  res.json({ page: result })
}
