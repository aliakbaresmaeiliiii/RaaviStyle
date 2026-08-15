import { cache } from "react"
import { createMedusaClient } from "@/lib/medusa"
import {
  colorFilters,
  products as localProducts,
  type Product,
} from "@/lib/catalog"

type MedusaImage = { url?: string | null }
type MedusaOption = {
  title?: string | null
  values?: Array<{ value?: string | null }>
}
type MedusaCategory = { handle?: string | null }
type MedusaVariant = {
  calculated_price?: {
    calculated_amount?: number | null
    original_amount?: number | null
  } | null
  prices?: Array<{ amount?: number | null }> | null
  manage_inventory?: boolean | null
  inventory_quantity?: number | null
}

type MedusaProduct = {
  id: string
  title?: string | null
  handle?: string | null
  thumbnail?: string | null
  images?: MedusaImage[] | null
  options?: MedusaOption[] | null
  categories?: MedusaCategory[] | null
  variants?: MedusaVariant[] | null
  metadata?: Record<string, unknown> | null
}

const NAME_TO_HEX: Record<string, string> = {
  black: "#1a1412",
  white: "#f5f1e8",
  navy: "#1e3a5f",
  cream: "#e4d5c3",
  olive: "#7e8774",
  gray: "#6b6b6b",
  grey: "#6b6b6b",
  brown: "#5c3d32",
  beige: "#d4c4b0",
}

const COLOR_TITLES = ["color", "colour", "رنگ"]
const SIZE_TITLES = ["size", "سایز"]

function optionValues(product: MedusaProduct, titles: string[]) {
  const option = product.options?.find((item) =>
    titles.includes((item.title ?? "").trim().toLowerCase()),
  )
  return (option?.values ?? [])
    .map((item) => item.value)
    .filter((value): value is string => Boolean(value))
}

function toHex(value: string) {
  const trimmed = value.trim()
  if (trimmed.startsWith("#")) {
    return trimmed
  }
  const named = NAME_TO_HEX[trimmed.toLowerCase()]
  if (named) {
    return named
  }
  return colorFilters.find((item) => item.label === trimmed)?.value ?? trimmed
}

function variantPrice(variant?: MedusaVariant) {
  const calculated = variant?.calculated_price?.calculated_amount
  if (typeof calculated === "number") {
    return Math.round(calculated)
  }
  const listed = variant?.prices?.[0]?.amount
  return typeof listed === "number" ? Math.round(listed) : 0
}

export function mapMedusaProduct(product: MedusaProduct): Product | null {
  if (!product.handle) {
    return null
  }

  const variant = product.variants?.[0]
  const price = variantPrice(variant)
  const original = variant?.calculated_price?.original_amount
  const colors = optionValues(product, COLOR_TITLES).map(toHex)
  const sizes = optionValues(product, SIZE_TITLES)
  const category =
    product.categories?.[0]?.handle ||
    (typeof product.metadata?.category === "string"
      ? product.metadata.category
      : "straight")
  const image =
    product.thumbnail || product.images?.[0]?.url || "/logo-mark.svg"

  return {
    id: product.id,
    title: product.title || product.handle,
    href: `/products/${product.handle}`,
    image,
    price,
    compareAt:
      typeof original === "number" && original > price
        ? Math.round(original)
        : undefined,
    tone: colors[0] || "#e4d5c3",
    colors: colors.length ? colors : ["#1a1412"],
    sizes: sizes.length ? sizes : ["۳۸", "۴۰", "۴۲"],
    category,
    inStock:
      variant?.manage_inventory === false ||
      (variant?.inventory_quantity ?? 1) > 0,
  }
}

async function fetchStoreProducts(): Promise<Product[]> {
  try {
    const sdk = createMedusaClient()
    const { regions } = await sdk.client.fetch<{
      regions: Array<{ id: string }>
    }>("/store/regions", { method: "GET", cache: "no-store" })
    const regionId = regions[0]?.id
    const { products } = await sdk.client.fetch<{ products: MedusaProduct[] }>(
      "/store/products",
      {
        method: "GET",
        cache: "no-store",
        query: {
          limit: 100,
          fields:
            "*variants.calculated_price,*variants.prices,*images,*categories,*options",
          ...(regionId ? { region_id: regionId } : {}),
        },
      }
    )
    return products
      .map(mapMedusaProduct)
      .filter((item): item is Product => Boolean(item))
  } catch {
    return localProducts
  }
}

export const loadStoreProducts = cache(fetchStoreProducts)

export async function loadStoreProduct(handle: string): Promise<Product | null> {
  const catalog = await loadStoreProducts()
  return catalog.find((item) => item.href.endsWith(`/${handle}`)) ?? null
}
