import { redirect } from "next/navigation"
import { AccountShell } from "@/components/store/account-shell"
import { getCustomer } from "@/lib/auth"
import type { ReactNode } from "react"

export default async function AccountLayout({
  children,
}: {
  children: ReactNode
}) {
  const customer = await getCustomer()

  if (!customer) {
    redirect("/login")
  }

  return <AccountShell>{children}</AccountShell>
}
