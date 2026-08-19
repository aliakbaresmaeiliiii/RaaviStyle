import { MedusaContainer } from "@medusajs/framework"
import {
  ContainerRegistrationKeys,
  Modules,
} from "@medusajs/framework/utils"
import {
  updateProductVariantsWorkflow,
  updateRegionsWorkflow,
  updateShippingOptionsWorkflow,
  updateStoresWorkflow,
} from "@medusajs/medusa/core-flows"

const IRR = "irr"
const EUR_TO_IRR = 150000

function irrFromPrices(
  prices: Array<{ amount?: number | null; currency_code?: string | null }>
) {
  const existing = prices.find(
    (price) => price.currency_code?.toLowerCase() === IRR
  )
  if (existing?.amount) {
    return existing.amount
  }
  const eur = prices.find((price) => price.currency_code?.toLowerCase() === "eur")
  if (typeof eur?.amount === "number") {
    return Math.round(eur.amount * EUR_TO_IRR)
  }
  const usd = prices.find((price) => price.currency_code?.toLowerCase() === "usd")
  if (typeof usd?.amount === "number") {
    return Math.round(usd.amount * 100000)
  }
  return 1500000
}

export default async function set_irr_currency({
  container,
}: {
  container: MedusaContainer
}) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)
  const query = container.resolve(ContainerRegistrationKeys.QUERY)
  const storeModule = container.resolve(Modules.STORE)
  const regionModule = container.resolve(Modules.REGION)
  const currencyModule = container.resolve(Modules.CURRENCY)
  const fulfillmentModule = container.resolve(Modules.FULFILLMENT)

  logger.info("Setting Iranian Rial as the default store currency...")

  const [irr] = await currencyModule.listCurrencies({ code: [IRR] })
  if (!irr) {
    await (
      currencyModule as unknown as {
        createCurrencies: (data: Array<{
          code: string
          symbol: string
          symbol_native: string
          name: string
          decimal_digits: number
        }>) => Promise<unknown>
      }
    ).createCurrencies([
      {
        code: IRR,
        symbol: "﷼",
        symbol_native: "﷼",
        name: "Iranian Rial",
        decimal_digits: 0,
      },
    ])
  }

  const stores = await storeModule.listStores(
    {},
    { take: 20, relations: ["supported_currencies"] }
  )
  for (const store of stores) {
    const current = store.supported_currencies ?? []
    const others = current
      .filter((currency) => currency.currency_code.toLowerCase() !== IRR)
      .map((currency) => ({
        currency_code: currency.currency_code,
        is_default: false,
      }))

    await updateStoresWorkflow(container).run({
      input: {
        selector: { id: store.id },
        update: {
          supported_currencies: [
            { currency_code: IRR, is_default: true },
            ...others,
          ],
        },
      },
    })
  }

  const regions = await regionModule.listRegions({}, { take: 20 })
  for (const region of regions) {
    await updateRegionsWorkflow(container).run({
      input: {
        selector: { id: region.id },
        update: { currency_code: IRR },
      },
    })
  }

  const { data: variants } = await query.graph({
    entity: "product_variant",
    fields: ["id", "prices.amount", "prices.currency_code"],
  })

  const variantUpdates = (variants ?? [])
    .map((variant) => {
      const prices =
        (
          variant as unknown as {
            prices?: Array<{
              amount?: number | null
              currency_code?: string | null
            }>
          }
        ).prices ?? []
      if (prices.some((price) => price.currency_code?.toLowerCase() === IRR)) {
        return null
      }
      const nextPrices = [
        {
          amount: irrFromPrices(prices),
          currency_code: IRR,
        },
        ...prices
          .filter((price) => price.currency_code && typeof price.amount === "number")
          .map((price) => ({
            amount: price.amount as number,
            currency_code: price.currency_code as string,
          })),
      ]
      return {
        id: variant.id as string,
        prices: nextPrices,
      }
    })
    .filter((item): item is { id: string; prices: Array<{ amount: number; currency_code: string }> } =>
      Boolean(item)
    )

  if (variantUpdates.length) {
    await updateProductVariantsWorkflow(container).run({
      input: {
        product_variants: variantUpdates,
      },
    })
  }

  const shippingOptions = await fulfillmentModule.listShippingOptions(
    {},
    { take: 50 }
  )
  for (const option of shippingOptions) {
    const amount = option.name?.includes("سریع") ? 990000 : 490000
    try {
      await updateShippingOptionsWorkflow(container).run({
        input: [
          {
            id: option.id,
            prices: [
              { currency_code: IRR, amount },
              ...(regions[0]
                ? [{ region_id: regions[0].id, amount }]
                : []),
            ],
          },
        ],
      })
    } catch (error) {
      logger.warn(
        `Could not set IRR price on shipping option ${option.id}: ${String(error)}`
      )
    }
  }

  logger.info("Iranian Rial is now the default currency.")
}
