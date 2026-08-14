import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { listSitePagesWorkflow } from "../../../../workflows/upsert-site-page"

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const { result } = await listSitePagesWorkflow(req.scope).run()
  res.json({ pages: result })
}
