import { AccountSidebar } from "@/components/store/account-sidebar"
import { getCustomer } from "@/lib/auth"
import { formatPhoneForDisplay } from "@/lib/phone"
import type { ReactNode } from "react"

export async function AccountShell({ children }: { children: ReactNode }) {
  const customer = await getCustomer()
  const name = [customer?.first_name, customer?.last_name]
    .filter(Boolean)
    .join(" ")

  return (
    <div className="mx-auto grid max-w-7xl gap-4 px-4 py-6 lg:grid-cols-[17rem_minmax(0,1fr)] lg:items-start lg:gap-5">
      <AccountSidebar
        signedIn={Boolean(customer)}
        name={name}
        phone={customer?.phone ? formatPhoneForDisplay(customer.phone) : ""}
      />
      <div className="min-w-0">{children}</div>
    </div>
  )
}
