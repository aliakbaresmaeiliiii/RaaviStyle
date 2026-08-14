import type { Metadata } from "next"
import { AccountShell } from "@/components/store/account-shell"
import { OrdersListView } from "@/components/store/orders-list-view"
import { messages } from "@/lib/i18n"

export const metadata: Metadata = {
  title: `${messages.track.historyTitle} | ${messages.meta.title}`,
  description: messages.track.metaDescription,
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: {
      index: false,
      follow: false,
      noimageindex: true,
    },
  },
}

export default function OrdersPage() {
  return (
    <AccountShell>
      <OrdersListView />
    </AccountShell>
  )
}
