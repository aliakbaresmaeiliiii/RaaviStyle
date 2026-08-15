import type {
  MedusaNextFunction,
  MedusaRequest,
  MedusaResponse,
} from "@medusajs/framework/http"
import { defineMiddlewares } from "@medusajs/framework/http"
import { normalizeProductHandlesInBody } from "../utils/normalize-product-handles"

type RequestWithValidatedBody = MedusaRequest & {
  validatedBody?: unknown
}

function normalizeProductHandles(
  req: MedusaRequest,
  _res: MedusaResponse,
  next: MedusaNextFunction
) {
  normalizeProductHandlesInBody(req.body)

  const validatedBody = (req as RequestWithValidatedBody).validatedBody
  if (validatedBody && validatedBody !== req.body) {
    normalizeProductHandlesInBody(validatedBody)
  }

  next()
}

export default defineMiddlewares({
  routes: [
    {
      matcher: /^\/admin\/products(\/.*)?$/,
      method: ["POST"],
      middlewares: [normalizeProductHandles],
    },
  ],
})
