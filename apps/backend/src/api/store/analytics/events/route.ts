import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { recordSiteEventWorkflow } from "../../../../workflows/site-analytics"

type EventBody = {
  path?: string
  session_id?: string
}

export async function POST(
  req: MedusaRequest<EventBody>,
  res: MedusaResponse
) {
  const body = (req.body || {}) as EventBody
  await recordSiteEventWorkflow(req.scope).run({
    input: {
      path: body.path,
      session_id: body.session_id,
    },
  })
  res.json({ ok: true })
}
