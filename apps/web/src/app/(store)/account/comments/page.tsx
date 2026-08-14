import { redirect } from "next/navigation"
import { CommentsView } from "@/components/store/comments-view"
import { getCustomer } from "@/lib/auth"
import { messages } from "@/lib/i18n"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: `${messages.account.comments} | ${messages.meta.title}`,
  robots: { index: false, follow: false },
}

export default async function CommentsPage() {
  const customer = await getCustomer()

  if (!customer) {
    redirect("/login")
  }

  const name = [customer.first_name, customer.last_name]
    .filter(Boolean)
    .join(" ")

  return <CommentsView defaultName={name} />
}
