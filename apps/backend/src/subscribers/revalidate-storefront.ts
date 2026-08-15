import type { SubscriberConfig } from "@medusajs/framework"
import { revalidateStorefront } from "../utils/revalidate-storefront"

export default async function revalidateStorefrontHandler() {
  await revalidateStorefront()
}

export const config: SubscriberConfig = {
  event: [
    "product.created",
    "product.updated",
    "product.deleted",
    "product-variant.created",
    "product-variant.updated",
    "product-variant.deleted",
  ],
}
