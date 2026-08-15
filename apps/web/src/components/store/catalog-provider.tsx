"use client"

import { createContext, useContext } from "react"
import { products as localProducts, type Product } from "@/lib/catalog"

const CatalogContext = createContext<Product[]>(localProducts)

export function CatalogProvider({
  products,
  children,
}: {
  products: Product[]
  children: React.ReactNode
}) {
  return (
    <CatalogContext.Provider value={products}>
      {children}
    </CatalogContext.Provider>
  )
}

export function useCatalog() {
  return useContext(CatalogContext)
}
