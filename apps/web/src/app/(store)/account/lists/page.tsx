import { redirect } from "next/navigation"
import { ListsView } from "@/components/store/lists-view"
import { getCustomer } from "@/lib/auth"
import { messages } from "@/lib/i18n"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: `${messages.account.lists} | ${messages.meta.title}`,
  robots: { index: false, follow: false },
}

export default async function ListsPage() {
  const customer = await getCustomer()

  if (!customer) {
    redirect("/login")
  }

  return <ListsView />
}
