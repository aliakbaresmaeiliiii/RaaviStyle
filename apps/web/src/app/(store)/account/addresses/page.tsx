import { redirect } from "next/navigation"
import { AddressesView } from "@/components/store/addresses-view"
import { getCustomer } from "@/lib/auth"
import { messages } from "@/lib/i18n"
import { formatNationalMobile } from "@/lib/phone"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: `${messages.account.addresses} | ${messages.meta.title}`,
  robots: { index: false, follow: false },
}

export default async function AddressesPage() {
  const customer = await getCustomer()

  if (!customer) {
    redirect("/login")
  }

  const name = [customer.first_name, customer.last_name]
    .filter(Boolean)
    .join(" ")

  return (
    <AddressesView
      defaultName={name}
      defaultPhone={
        customer.phone ? formatNationalMobile(customer.phone) : ""
      }
    />
  )
}
