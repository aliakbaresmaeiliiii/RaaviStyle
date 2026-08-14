import { MedusaContainer } from "@medusajs/framework"
import {
  ContainerRegistrationKeys,
  Modules,
} from "@medusajs/framework/utils"

const PRODUCT_COPY: Record<string, { title: string; description: string }> = {
  "t-shirt": {
    title: "شلوار بگ نخی",
    description: "شلوار بگ نخی سبک، مناسب روزمره. دوخت ایران.",
  },
  sweatshirt: {
    title: "شلوار مام‌استایل کتان",
    description: "مام‌استایل با کمر راحت و پارچه کتان.",
  },
  sweatpants: {
    title: "شلوار کارگو",
    description: "کارگو با جیب و جزئیات برای استفاده روزانه.",
  },
  shorts: {
    title: "شلوار راسته کتان",
    description: "راسته کلاسیک با قد استاندارد و پارچه کتان.",
  },
}

const CATEGORY_COPY: Record<string, string> = {
  Shirts: "بگ",
  Sweatshirts: "مام‌استایل",
  Pants: "کارگو",
  Merch: "راسته",
}

const OPTION_TITLES: Record<string, string> = {
  Size: "سایز",
  Color: "رنگ",
}

const OPTION_VALUES: Record<string, string> = {
  S: "۳۸",
  M: "۴۰",
  L: "۴۲",
  XL: "۴۴",
  Black: "مشکی",
  White: "سفید",
}

export default async function persianize_seed_data({
  container,
}: {
  container: MedusaContainer
}) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)
  const query = container.resolve(ContainerRegistrationKeys.QUERY)
  const storeModule = container.resolve(Modules.STORE)
  const salesChannelModule = container.resolve(Modules.SALES_CHANNEL)
  const regionModule = container.resolve(Modules.REGION)
  const stockLocationModule = container.resolve(Modules.STOCK_LOCATION)
  const productModule = container.resolve(Modules.PRODUCT)
  const fulfillmentModule = container.resolve(Modules.FULFILLMENT)

  logger.info("Translating seeded data to Persian...")

  const stores = await storeModule.listStores({}, { take: 20 })
  for (const store of stores) {
    if (store.name === "Default Store") {
      await storeModule.updateStores(store.id, { name: "راوی‌استایل" })
    }
  }

  const channels = await salesChannelModule.listSalesChannels({}, { take: 20 })
  for (const channel of channels) {
    if (channel.name === "Default Sales Channel") {
      await salesChannelModule.updateSalesChannels(channel.id, {
        name: "فروشگاه راوی‌استایل",
        description: "کانال فروش فروشگاه راوی‌استایل",
      })
    }
  }

  const regions = await regionModule.listRegions({}, { take: 20 })
  for (const region of regions) {
    if (region.name === "Europe") {
      await regionModule.updateRegions(region.id, { name: "ایران" })
    }
  }

  const locations = await stockLocationModule.listStockLocations({}, { take: 20 })
  for (const location of locations) {
    if (location.name === "European Warehouse") {
      await stockLocationModule.updateStockLocations(location.id, {
        name: "انبار تهران",
      })
    }
  }

  const shippingOptions = await fulfillmentModule.listShippingOptions(
    {},
    { take: 50 }
  )
  for (const option of shippingOptions) {
    if (option.name === "Standard Shipping") {
      await fulfillmentModule.updateShippingOptions(option.id, {
        name: "ارسال عادی",
      })
    }
    if (option.name === "Express Shipping") {
      await fulfillmentModule.updateShippingOptions(option.id, {
        name: "ارسال سریع",
      })
    }
  }

  const categories = await productModule.listProductCategories({}, { take: 50 })
  for (const category of categories) {
    const nextName = CATEGORY_COPY[category.name]
    if (nextName) {
      await productModule.updateProductCategories(category.id, {
        name: nextName,
      })
    }
  }

  const options = await productModule.listProductOptions({}, { take: 50 })
  for (const option of options) {
    const nextTitle = OPTION_TITLES[option.title]
    if (nextTitle) {
      await productModule.updateProductOptions(option.id, { title: nextTitle })
    }
  }

  try {
    const { data: optionValues } = await query.graph({
      entity: "product_option_value",
      fields: ["id", "value"],
    })
    for (const value of optionValues) {
      const nextValue = OPTION_VALUES[value.value]
      if (nextValue && typeof productModule.updateProductOptionValues === "function") {
        await productModule.updateProductOptionValues(value.id, {
          value: nextValue,
        })
      }
    }
  } catch (error) {
    logger.warn(`Could not translate option values: ${String(error)}`)
  }

  const products = await productModule.listProducts({}, { take: 50 })
  for (const product of products) {
    const copy = PRODUCT_COPY[product.handle]
    if (copy) {
      await productModule.updateProducts(product.id, {
        title: copy.title,
        description: copy.description,
      })
    }
  }

  const variants = await productModule.listProductVariants({}, { take: 200 })
  for (const variant of variants) {
    const nextTitle = variant.title
      .split(" / ")
      .map((part) => OPTION_VALUES[part] ?? part)
      .join(" / ")
    if (nextTitle !== variant.title) {
      await productModule.updateProductVariants(variant.id, {
        title: nextTitle,
      })
    }
  }

  logger.info("Finished translating seeded data to Persian.")
}
