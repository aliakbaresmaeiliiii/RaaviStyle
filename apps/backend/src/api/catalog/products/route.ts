import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { listStoreCatalogWorkflow } from "../../../workflows/list-store-catalog"

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const { result } = await listStoreCatalogWorkflow(req.scope).run()
  res.json(result)
}
