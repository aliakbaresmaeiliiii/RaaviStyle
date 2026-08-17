"use client"

import { createContext, useContext } from "react"
import {
  defaultFilters,
  products as localProducts,
  type CatalogFilters,
  type Product,
} from "@/lib/catalog"

type CatalogContextValue = {
  products: Product[]
  filters: CatalogFilters
}

const CatalogContext = createContext<CatalogContextValue>({
  products: localProducts,
  filters: defaultFilters,
})

export function CatalogProvider({
  products,
  filters = defaultFilters,
  children,
}: {
  products: Product[]
  filters?: CatalogFilters
  children: React.ReactNode
}) {
  return (
    <CatalogContext.Provider value={{ products, filters }}>
      {children}
    </CatalogContext.Provider>
  )
}

export function useCatalog() {
  return useContext(CatalogContext).products
}

export function useCatalogFilters() {
  return useContext(CatalogContext).filters
}
