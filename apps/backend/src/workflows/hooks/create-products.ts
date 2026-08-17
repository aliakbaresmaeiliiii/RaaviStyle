import { createProductsWorkflow } from "@medusajs/medusa/core-flows"
import {
  ContainerRegistrationKeys,
  Modules,
} from "@medusajs/framework/utils"

createProductsWorkflow.hooks.productsCreated(
  async ({ products }, { container }) => {
    const storeModule = container.resolve(Modules.STORE)
    const [store] = await storeModule.listStores({}, { take: 1 })
    const channelId = store?.default_sales_channel_id
    if (!channelId) {
      return
    }

    const link = container.resolve(ContainerRegistrationKeys.LINK)
    const query = container.resolve(ContainerRegistrationKeys.QUERY)
    const { data } = await query.graph({
      entity: "product",
      fields: ["id", "sales_channels.id"],
      filters: { id: products.map((product) => product.id) },
    })

    const alreadyLinked = new Set(
      (
        (data || []) as Array<{
          id?: string
          sales_channels?: Array<{ id?: string }>
        }>
      )
        .filter((product) =>
          product.sales_channels?.some((channel) => channel.id === channelId)
        )
        .map((product) => product.id)
    )

    for (const product of products) {
      if (alreadyLinked.has(product.id)) {
        continue
      }

      try {
        await link.create({
          [Modules.PRODUCT]: {
            product_id: product.id,
          },
          [Modules.SALES_CHANNEL]: {
            sales_channel_id: channelId,
          },
        })
      } catch {
        // Already linked.
      }
    }
  }
)
