"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { FaIcon } from "@/components/fa-icon"
import { messages } from "@/lib/i18n"

const navItems = [
  { href: "/account", icon: "fa-house", label: messages.account.activity, exact: true },
  { href: "/products", icon: "fa-sparkles", label: messages.account.plus },
  { href: "/orders", icon: "fa-bag-shopping", label: messages.account.ordersShort },
  { href: "/account/lists", icon: "fa-heart", label: messages.account.lists },
  { href: "/account/comments", icon: "fa-comment", label: messages.account.comments },
  { href: "/account/addresses", icon: "fa-signs-post", label: messages.account.addresses },
]

export function AccountSidebar({
  signedIn,
  name,
  phone,
}: {
  signedIn: boolean
  name: string
  phone: string
}) {
  const pathname = usePathname()

  return (
    <aside className="space-y-3 lg:sticky lg:top-28">
      <section className="rounded-xl bg-surface p-4 shadow-card">
        {signedIn ? (
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="truncate font-medium">
                {name || messages.nav.account}sadasdfsdfsd
              </p>
              {phone ? (
                <p className="mt-1 text-sm text-muted" dir="ltr">
                  {phone}
                </p>
              ) : null}
            </div>
            <Link
              href="/account"
              className="text-shop"
              aria-label={messages.account.editProfile}
            >
              <FaIcon icon="fa-pen" className="text-xs" />
            </Link>
          </div>
        ) : (
          <div>
            <p className="text-sm font-medium">{messages.nav.signIn}</p>
            <p className="mt-1 text-xs leading-6 text-muted">
              {messages.account.loginHint}
            </p>
            <Link
              href="/login"
              className="mt-3 flex h-10 items-center justify-center rounded-lg bg-espresso text-sm text-white"
            >
              {messages.account.loginCta}
            </Link>
          </div>
        )}
      </section>

      <section className="overflow-hidden rounded-xl bg-[#f3e8ff] p-4 dark:bg-[#2a1a38]">
        <p className="text-sm leading-7 text-ink">{messages.account.plusPromo}</p>
        <Link
          href="/products"
          className="mt-2 inline-flex items-center gap-1 text-sm text-[#9d4edd]"
        >
          {messages.account.plusCta}
          <FaIcon icon="fa-chevron-left" className="text-[10px]" />
        </Link>
      </section>

      <nav className="overflow-hidden rounded-xl bg-surface py-1 shadow-card">
        {navItems.map((item) => {
          const active = item.exact
            ? pathname === item.href
            : pathname === item.href || pathname.startsWith(`${item.href}/`)

          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={active ? "page" : undefined}
              className={`relative flex items-center gap-3 px-4 py-3 text-sm ${
                active ? "bg-soft font-medium text-sale" : "text-ink hover:bg-soft"
              }`}
            >
              {active ? (
                <span className="absolute inset-s-0 inset-y-2 w-0.75 rounded-full bg-sale" />
              ) : null}
              <FaIcon
                icon={item.icon}
                className={`w-4 ${item.href === "/products" ? "text-[#9d4edd]" : "text-muted"}`}
              />
              {item.label}
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}
