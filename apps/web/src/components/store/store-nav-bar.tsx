"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { FaIcon } from "@/components/fa-icon"
import { CategoryMenu } from "@/components/store/category-menu"
import { messages } from "@/lib/i18n"

const links = [
  {
    href: "/products?cat=sale",
    icon: "fa-bolt",
    label: messages.shop.amazing,
    match: "/products?cat=sale",
  },
  {
    href: "/products",
    icon: "fa-fire",
    label: messages.shop.popular,
  },
  {
    href: "/orders",
    icon: "fa-box",
    label: messages.track.myOrders,
  },
  {
    href: "/faq",
    icon: "fa-circle-question",
    label: messages.faq.nav,
  },
  {
    href: "/about",
    icon: "fa-circle-info",
    label: messages.about.nav,
  },
]

export function StoreNavBar() {
  const pathname = usePathname()

  return (
    <nav
      className="border-t border-line"
      aria-label={messages.nav.categories}
    >
      <div className="mx-auto flex max-w-7xl items-center gap-1 px-4">
        <CategoryMenu />
        <span className="mx-2 hidden h-4 w-px shrink-0 bg-line sm:block" />
        <ul className="no-scrollbar flex min-w-0 flex-1 items-center gap-1 overflow-x-auto">
          {links.map((item) => {
            const active =
              item.href === "/products"
                ? pathname === "/products"
                : pathname === item.href ||
                  pathname.startsWith(`${item.href}/`)

            return (
              <li key={item.href} className="shrink-0">
                <Link
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={`inline-flex items-center gap-2 px-2.5 py-3 text-sm ${
                    active ? "text-mocha" : "text-muted hover:text-ink"
                  }`}
                >
                  <FaIcon icon={item.icon} className="text-xs" />
                  {item.label}
                </Link>
              </li>
            )
          })}
        </ul>
        <p className="ms-3 hidden shrink-0 items-center gap-2 text-xs text-muted lg:flex">
          <FaIcon icon="fa-location-dot" className="text-mocha" />
          {messages.nav.deliverTo}
        </p>
      </div>
    </nav>
  )
}
