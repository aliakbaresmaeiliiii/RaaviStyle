import type { Metadata } from "next"
import { CheckoutView } from "@/components/store/checkout-view"
import { getCustomer } from "@/lib/auth"
import { messages } from "@/lib/i18n"

export const metadata: Metadata = {
  title: `${messages.pay.title} | ${messages.meta.title}`,
}

export default async function CheckoutPage() {
  const customer = await getCustomer()
  const name = [customer?.first_name, customer?.last_name]
    .filter(Boolean)
    .join(" ")

  return (
    <CheckoutView
      defaultPhone={customer?.phone ?? ""}
      defaultName={name}
    />
  )
}
