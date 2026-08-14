"use client"

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  useSyncExternalStore,
} from "react"
import { CartAddedDialog } from "@/components/store/cart-added-dialog"
import {
  cartCount,
  getCartServerSnapshot,
  getCartSnapshot,
  parseCart,
  removeLine,
  setLineQuantity,
  subscribeCart,
  upsertLine,
  writeCart,
  type CartLine,
} from "@/lib/cart"

type AddItemInput = Pick<CartLine, "productId" | "color" | "size"> & {
  quantity?: number
}

type CartContextValue = {
  lines: CartLine[]
  count: number
  ready: boolean
  addItem: (input: AddItemInput) => void
  updateQuantity: (key: string, quantity: number) => void
  removeItem: (key: string) => void
  clearCart: () => void
}

const CartContext = createContext<CartContextValue | null>(null)

function subscribeReady() {
  return () => undefined
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const raw = useSyncExternalStore(
    subscribeCart,
    getCartSnapshot,
    getCartServerSnapshot,
  )
  const lines = useMemo(() => parseCart(raw), [raw])
  const ready = useSyncExternalStore(subscribeReady, () => true, () => false)
  const [added, setAdded] = useState<CartLine | null>(null)

  const addItem = useCallback((input: AddItemInput) => {
    const quantity = input.quantity ?? 1
    writeCart(upsertLine(parseCart(getCartSnapshot()), input))
    setAdded({
      productId: input.productId,
      color: input.color,
      size: input.size,
      quantity,
    })
  }, [])

  const updateQuantity = useCallback((key: string, quantity: number) => {
    writeCart(setLineQuantity(parseCart(getCartSnapshot()), key, quantity))
  }, [])

  const removeItem = useCallback((key: string) => {
    writeCart(removeLine(parseCart(getCartSnapshot()), key))
  }, [])

  const clearCart = useCallback(() => {
    writeCart([])
  }, [])

  const closeAdded = useCallback(() => {
    setAdded(null)
  }, [])

  const value = useMemo(
    () => ({
      lines,
      count: cartCount(lines),
      ready,
      addItem,
      updateQuantity,
      removeItem,
      clearCart,
    }),
    [lines, ready, addItem, updateQuantity, removeItem, clearCart],
  )

  return (
    <CartContext.Provider value={value}>
      {children}
      {added ? <CartAddedDialog item={added} onClose={closeAdded} /> : null}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)

  if (!context) {
    throw new Error("useCart must be used within CartProvider")
  }

  return context
}
