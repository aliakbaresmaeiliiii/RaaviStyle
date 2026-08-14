import { createMedusaClient } from "@/lib/medusa"
import {
  colorFilters,
  products as localProducts,
  type Product,
} from "@/lib/catalog"

type MedusaImage = { url?: string | null }
type MedusaOption = { title?: string | null; values?: Array<{ value?: string | null }> }
type MedusaCategory = { handle?: string | null }
type MedusaVariant = {
  calculated_price?: {
    calculated_amount?: number | null
    original_amount?: number | null
  } | null
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

function optionValues(product: MedusaProduct, title: string) {
  const option = product.options?.find(
    (item) => item.title?.toLowerCase() === title.toLowerCase(),
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
  return (
    colorFilters.find((item) => item.label === trimmed)?.value ?? trimmed
  )
}

export function mapMedusaProduct(product: MedusaProduct): Product | null {
  if (!product.handle) {
    return null
  }

  const variant = product.variants?.[0]
  const amount = variant?.calculated_price?.calculated_amount
  const original = variant?.calculated_price?.original_amount
  const price = typeof amount === "number" ? Math.round(amount) : 0
  const colors = optionValues(product, "Color").map(toHex)
  const sizes = optionValues(product, "Size")
  const category =
    product.categories?.[0]?.handle ||
    (typeof product.metadata?.category === "string"
      ? product.metadata.category
      : "straight")
  const image =
    product.thumbnail ||
    product.images?.[0]?.url ||
    ""

  if (!image || !price) {
    return {
      id: product.id,
      title: product.title || product.handle,
      href: `/products/${product.handle}`,
      image: image || "/logo-mark.svg",
      price: price || 0,
      compareAt:
        typeof original === "number" && original > price ? Math.round(original) : undefined,
      tone: colors[0] || "#e4d5c3",
      colors: colors.length ? colors : ["#1a1412"],
      sizes: sizes.length ? sizes : ["۳۸", "۴۰", "۴۲"],
      category,
      inStock:
        variant?.manage_inventory === false ||
        (variant?.inventory_quantity ?? 1) > 0,
    }
  }

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

export async function loadStoreProducts(): Promise<Product[]> {
  try {
    const sdk = createMedusaClient()
    const { products } = await sdk.store.product.list({
      limit: 100,
      fields: "*variants.calculated_price,*images,*categories,*options",
    })
    const mapped = (products as MedusaProduct[])
      .map(mapMedusaProduct)
      .filter((item): item is Product => Boolean(item))

    if (!mapped.length) {
      return localProducts
    }

    const remoteHrefs = new Set(mapped.map((item) => item.href))
    return [
      ...mapped,
      ...localProducts.filter((item) => !remoteHrefs.has(item.href)),
    ]
  } catch {
    return localProducts
  }
}

export async function loadStoreProduct(handle: string): Promise<Product | null> {
  const catalog = await loadStoreProducts()
  return catalog.find((item) => item.href.endsWith(`/${handle}`)) ?? null
}
