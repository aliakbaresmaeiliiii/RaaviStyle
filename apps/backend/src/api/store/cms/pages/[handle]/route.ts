import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { listSitePagesWorkflow } from "../../../../../workflows/upsert-site-page"

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const handle = req.params.handle
  const { result } = await listSitePagesWorkflow(req.scope).run()
  const page = result.find((item) => item.handle === handle)

  if (!page) {
    res.status(404).json({ message: "Page not found" })
    return
  }

  res.json({ page })
}
