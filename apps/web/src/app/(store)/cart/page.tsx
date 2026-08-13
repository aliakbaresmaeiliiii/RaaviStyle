import type { Metadata } from "next"
import { CartView } from "@/components/store/cart-view"
import { messages } from "@/lib/i18n"

export const metadata: Metadata = {
  title: `${messages.shop.cart} | ${messages.meta.title}`,
}

export default function CartPage() {
  return <CartView />
}
