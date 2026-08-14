import type { Metadata } from "next"
import { CheckoutSuccess } from "@/components/store/checkout-success"
import { messages } from "@/lib/i18n"

export const metadata: Metadata = {
  title: `${messages.pay.successTitle} | ${messages.meta.title}`,
}

type SuccessPageProps = {
  searchParams: Promise<{ order?: string }>
}

export default async function CheckoutSuccessPage({
  searchParams,
}: SuccessPageProps) {
  const { order } = await searchParams

  return <CheckoutSuccess orderId={order ?? ""} />
}
