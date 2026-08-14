import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { getAnalyticsOverviewWorkflow } from "../../../../workflows/site-analytics"

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const { result } = await getAnalyticsOverviewWorkflow(req.scope).run()
  res.json(result)
}
