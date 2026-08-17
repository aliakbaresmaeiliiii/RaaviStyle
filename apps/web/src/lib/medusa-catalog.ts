import { cache } from "react"
import { createMedusaClient } from "@/lib/medusa"
import {
  categoryIcon,
  colorFilters,
  defaultFilters,
  products as localProducts,
  type CatalogFilters,
  type Product,
} from "@/lib/catalog"

type MedusaImage = { url?: string | null }
type MedusaOption = {
  title?: string | null
  values?: Array<{ value?: string | null }>
}
type MedusaCategory = { handle?: string | null; name?: string | null }
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

type CatalogApiFilters = {
  categories?: Array<{ id?: string | null; label?: string | null }>
  colors?: Array<{ label?: string | null; value?: string | null }>
  sizes?: string[]
  price_max?: number
}

type CatalogApiResponse = {
  products?: MedusaProduct[]
  filters?: CatalogApiFilters
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
  مشکی: "#1a1412",
  سفید: "#f5f1e8",
  سرمه‌ای: "#1e3a5f",
  کرم: "#e4d5c3",
  زیتونی: "#7e8774",
  طوسی: "#6b6b6b",
  قهوه‌ای: "#5c3d32",
  بژ: "#d4c4b0",
}

const COLOR_TITLES = ["color", "colour", "رنگ"]
const SIZE_TITLES = ["size", "سایز"]

function backendUrl() {
  return (
    process.env.MEDUSA_BACKEND_URL ??
    process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL ??
    "http://localhost:9000"
  ).replace(/\/$/, "")
}

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
  const named = NAME_TO_HEX[trimmed] || NAME_TO_HEX[trimmed.toLowerCase()]
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

function mapCategory(product: MedusaProduct) {
  return (
    product.categories?.[0]?.handle ||
    product.categories?.[0]?.name ||
    (typeof product.metadata?.category === "string"
      ? product.metadata.category
      : "")
  )
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
    colors,
    sizes,
    category: mapCategory(product),
    inStock:
      variant?.manage_inventory === false ||
      (variant?.inventory_quantity ?? 1) > 0,
  }
}

function toCatalog(products: MedusaProduct[]) {
  return products
    .map(mapMedusaProduct)
    .filter((item): item is Product => Boolean(item))
}

function mapApiFilters(filters?: CatalogApiFilters): CatalogFilters | null {
  if (!filters) {
    return null
  }

  const categories = (filters.categories ?? [])
    .map((category) => {
      const id = category.id?.trim()
      const label = category.label?.trim() || id
      if (!id || !label) {
        return null
      }
      return {
        id,
        label,
        icon: categoryIcon(id, label),
        href: `/products?cat=${encodeURIComponent(id)}`,
      }
    })
    .filter((item): item is CatalogFilters["categories"][number] => Boolean(item))

  const colors = (filters.colors ?? [])
    .map((color) => {
      const label = color.label?.trim()
      const value = color.value?.trim() || (label ? toHex(label) : "")
      if (!label || !value) {
        return null
      }
      return { id: value, label, value }
    })
    .filter((item): item is CatalogFilters["colors"][number] => Boolean(item))

  const sizes = (filters.sizes ?? []).filter(Boolean)
  const priceMax = filters.price_max || defaultFilters.priceMax

  if (!categories.length && !colors.length && !sizes.length) {
    return null
  }

  return {
    categories: categories.length ? categories : defaultFilters.categories,
    colors: colors.length ? colors : defaultFilters.colors,
    sizes: sizes.length ? sizes : defaultFilters.sizes,
    priceMax,
  }
}

async function fetchPublicCatalog(): Promise<CatalogApiResponse | null> {
  try {
    const response = await fetch(`${backendUrl()}/catalog/products`, {
      cache: "no-store",
    })
    if (!response.ok) {
      return null
    }
    return (await response.json()) as CatalogApiResponse
  } catch {
    return null
  }
}

async function fetchStoreApiCatalog(): Promise<MedusaProduct[] | null> {
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
  } catch {
    return null
  }
}

export type StoreCatalog = {
  products: Product[]
  filters: CatalogFilters
}

async function fetchStoreCatalog(): Promise<StoreCatalog> {
  const payload = await fetchPublicCatalog()
  if (payload?.products?.length) {
    return {
      products: toCatalog(payload.products),
      filters: mapApiFilters(payload.filters) || defaultFilters,
    }
  }

  const storeProducts = await fetchStoreApiCatalog()
  if (storeProducts?.length) {
    return {
      products: toCatalog(storeProducts),
      filters: defaultFilters,
    }
  }

  return {
    products: localProducts,
    filters: defaultFilters,
  }
}

export const loadStoreCatalog = cache(fetchStoreCatalog)

export async function loadStoreProducts(): Promise<Product[]> {
  return (await loadStoreCatalog()).products
}

export async function loadStoreProduct(handle: string): Promise<Product | null> {
  const catalog = await loadStoreProducts()
  return catalog.find((item) => item.href.endsWith(`/${handle}`)) ?? null
}
