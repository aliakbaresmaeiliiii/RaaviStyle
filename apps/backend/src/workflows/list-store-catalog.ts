import {
  createStep,
  createWorkflow,
  StepResponse,
  WorkflowResponse,
} from "@medusajs/framework/workflows-sdk"
import {
  ContainerRegistrationKeys,
  ProductStatus,
} from "@medusajs/framework/utils"
import { publicFileUrl } from "../utils/public-file-url"

type CatalogImage = { url?: string | null }
type CatalogOptionValue = { value?: string | null }
type CatalogOption = {
  title?: string | null
  values?: CatalogOptionValue[] | null
}
type CatalogCategory = { handle?: string | null; name?: string | null }
type CatalogPrice = {
  amount?: number | null
  currency_code?: string | null
}
type CatalogVariant = {
  manage_inventory?: boolean | null
  inventory_quantity?: number | null
  prices?: CatalogPrice[] | null
}
type CatalogProduct = {
  id: string
  title?: string | null
  handle?: string | null
  status?: string | null
  thumbnail?: string | null
  created_at?: string | Date | null
  metadata?: Record<string, unknown> | null
  images?: CatalogImage[] | null
  options?: CatalogOption[] | null
  categories?: CatalogCategory[] | null
  variants?: CatalogVariant[] | null
}

export type StoreCatalogProduct = {
  id: string
  title: string | null
  handle: string | null
  thumbnail: string | null
  created_at: string | null
  metadata: Record<string, unknown> | null
  images: Array<{ url: string }>
  options: Array<{ title: string | null; values: Array<{ value: string }> }>
  categories: Array<{ handle: string | null; name: string | null }>
  variants: Array<{
    manage_inventory: boolean | null
    inventory_quantity: number | null
    prices: Array<{ amount: number; currency_code: string }>
    calculated_price: {
      calculated_amount: number | null
      original_amount: number | null
    }
  }>
}

export type StoreCatalogFilters = {
  categories: Array<{ id: string; label: string }>
  colors: Array<{ label: string; value: string }>
  sizes: string[]
  price_max: number
}

export type StoreCatalogResult = {
  products: StoreCatalogProduct[]
  filters: StoreCatalogFilters
}

const COLOR_TITLES = ["color", "colour", "رنگ"]
const SIZE_TITLES = ["size", "سایز"]
const COLOR_HEX: Record<string, string> = {
  black: "#1a1412",
  مشکی: "#1a1412",
  white: "#f5f1e8",
  سفید: "#f5f1e8",
  navy: "#1e3a5f",
  سرمه‌ای: "#1e3a5f",
  cream: "#e4d5c3",
  کرم: "#e4d5c3",
  olive: "#7e8774",
  زیتونی: "#7e8774",
  gray: "#6b6b6b",
  grey: "#6b6b6b",
  طوسی: "#6b6b6b",
  brown: "#5c3d32",
  قهوه‌ای: "#5c3d32",
  beige: "#d4c4b0",
  بژ: "#d4c4b0",
}

function colorValue(label: string) {
  if (label.startsWith("#")) {
    return label
  }
  return COLOR_HEX[label] || COLOR_HEX[label.toLowerCase()] || label
}

function asciiDigits(value: string) {
  return value
    .replace(/[۰-۹]/g, (digit) => String("۰۱۲۳۴۵۶۷۸۹".indexOf(digit)))
    .replace(/[٠-٩]/g, (digit) => String("٠١٢٣٤٥٦٧٨٩".indexOf(digit)))
}

function sortSizes(values: string[]) {
  return [...values].sort((left, right) => {
    const a = Number(asciiDigits(left))
    const b = Number(asciiDigits(right))
    if (!Number.isNaN(a) && !Number.isNaN(b)) {
      return a - b
    }
    return left.localeCompare(right, "fa")
  })
}

function isColorOption(title?: string | null) {
  return COLOR_TITLES.includes((title ?? "").trim().toLowerCase())
}

function isSizeOption(title?: string | null) {
  return SIZE_TITLES.includes((title ?? "").trim().toLowerCase())
}

function buildFilters(
  products: StoreCatalogProduct[],
  categories: Array<{ handle?: string | null; name?: string | null }>
): StoreCatalogFilters {
  const colors = new Map<string, { label: string; value: string }>()
  const sizes = new Set<string>()
  let priceMax = 0

  for (const product of products) {
    for (const option of product.options) {
      for (const item of option.values) {
        if (isColorOption(option.title)) {
          const value = colorValue(item.value)
          colors.set(value, { label: item.value, value })
        }
        if (isSizeOption(option.title)) {
          sizes.add(item.value)
        }
      }
    }
    for (const variant of product.variants) {
      const amount = variant.calculated_price.calculated_amount
      if (typeof amount === "number" && amount > priceMax) {
        priceMax = amount
      }
    }
  }

  const fromProducts = products.flatMap((product) => product.categories)
  const merged = new Map<string, { id: string; label: string }>()
  for (const category of [...categories, ...fromProducts]) {
    const id = category.handle || category.name
    const label = category.name || category.handle
    if (!id || !label) {
      continue
    }
    if (!merged.has(id)) {
      merged.set(id, { id, label })
    }
  }

  return {
    categories: Array.from(merged.values()),
    colors: Array.from(colors.values()),
    sizes: sortSizes(Array.from(sizes)),
    price_max: Math.max(priceMax, 1000000),
  }
}

function pickAmount(prices: CatalogPrice[] | null | undefined) {
  const list = (prices || []).filter(
    (price) => typeof price.amount === "number"
  )
  const irr = list.find((price) => price.currency_code?.toLowerCase() === "irr")
  return irr?.amount ?? list[0]?.amount ?? null
}

function mapProduct(product: CatalogProduct): StoreCatalogProduct | null {
  if (!product.handle || product.status !== ProductStatus.PUBLISHED) {
    return null
  }

  const variants = (product.variants || []).map((variant) => {
    const prices = (variant.prices || [])
      .filter(
        (price): price is { amount: number; currency_code: string } =>
          typeof price.amount === "number" && Boolean(price.currency_code)
      )
      .map((price) => ({
        amount: price.amount,
        currency_code: price.currency_code,
      }))
    const amount = pickAmount(variant.prices)

    return {
      manage_inventory: variant.manage_inventory ?? null,
      inventory_quantity: variant.inventory_quantity ?? null,
      prices,
      calculated_price: {
        calculated_amount: amount,
        original_amount: amount,
      },
    }
  })

  const images = (product.images || [])
    .map((image) => publicFileUrl(image.url))
    .filter((url): url is string => Boolean(url))
    .map((url) => ({ url }))

  return {
    id: product.id,
    title: product.title ?? null,
    handle: product.handle,
    thumbnail: publicFileUrl(product.thumbnail) || images[0]?.url || null,
    created_at: product.created_at
      ? new Date(product.created_at).toISOString()
      : null,
    metadata: product.metadata ?? null,
    images,
    options: (product.options || []).map((option) => ({
      title: option.title ?? null,
      values: (option.values || [])
        .map((value) => value.value)
        .filter((value): value is string => Boolean(value))
        .map((value) => ({ value })),
    })),
    categories: (product.categories || []).map((category) => ({
      handle: category.handle ?? null,
      name: category.name ?? null,
    })),
    variants,
  }
}

const listStoreCatalogStep = createStep(
  "list-store-catalog",
  async (_, { container }) => {
    const query = container.resolve(ContainerRegistrationKeys.QUERY)
    const { data } = await query.graph({
      entity: "product",
      fields: [
        "id",
        "title",
        "handle",
        "status",
        "thumbnail",
        "created_at",
        "metadata",
        "images.url",
        "options.title",
        "options.values.value",
        "categories.handle",
        "categories.name",
        "variants.manage_inventory",
        "variants.inventory_quantity",
        "variants.prices.amount",
        "variants.prices.currency_code",
      ],
      filters: {
        status: ProductStatus.PUBLISHED,
      },
      pagination: {
        skip: 0,
        take: 100,
      },
    })

    const { data: categoryRows } = await query.graph({
      entity: "product_category",
      fields: ["name", "handle", "is_active", "is_internal", "rank"],
      pagination: {
        skip: 0,
        take: 100,
      },
    })

    const products = ((data || []) as CatalogProduct[])
      .map(mapProduct)
      .filter((item): item is StoreCatalogProduct => Boolean(item))
      .sort((left, right) => {
        const a = left.created_at ? Date.parse(left.created_at) : 0
        const b = right.created_at ? Date.parse(right.created_at) : 0
        return b - a
      })

    const categories = (
      (categoryRows || []) as Array<{
        name?: string | null
        handle?: string | null
        is_active?: boolean | null
        is_internal?: boolean | null
        rank?: number | null
      }>
    )
      .filter((category) => category.is_active !== false && !category.is_internal)
      .sort((left, right) => (left.rank ?? 0) - (right.rank ?? 0))

    return new StepResponse({
      products,
      filters: buildFilters(products, categories),
    })
  }
)

export const listStoreCatalogWorkflow = createWorkflow(
  "list-store-catalog",
  () => {
    const products = listStoreCatalogStep()
    return new WorkflowResponse(products)
  }
)
