"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { FaIcon } from "@/components/fa-icon";
import { CartBadge } from "@/components/store/cart-badge";
import { messages } from "@/lib/i18n";

export function MobileDockNav({
  accountHref,
  signedIn,
}: {
  accountHref: string;
  signedIn: boolean;
}) {
  const pathname = usePathname();

  const items = [
    { href: "/", icon: "fa-house", label: messages.shop.home, exact: true },
    {
      href: "/products",
      icon: "fa-table-cells",
      label: messages.shop.categories,
    },
    { href: "/cart", icon: "fa-cart-shopping", label: messages.shop.dockCart },
    {
      href: accountHref,
      icon: "fa-user",
      label: signedIn ? messages.shop.dockAccount : messages.shop.dockSignIn,
    },
  ];

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-surface pb-[env(safe-area-inset-bottom)] sm:hidden"
      aria-label={messages.shop.home}
    >
      <ul className="grid grid-cols-4 text-[11px]">
        {items.map((item) => {
          const active = item.exact
            ? pathname === item.href
            : pathname === item.href || pathname.startsWith(`${item.href}/`);
          return (
            <li key={`${item.href}-${item.label}`}>
              <Link
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={`relative flex min-h-12 flex-col items-center justify-center gap-1 py-2 ${
                  active ? "text-espresso" : "text-muted"
                }`}
              >
                <span className="relative">
                  <FaIcon icon={item.icon} />
                  {item.href === "/cart" ? <CartBadge /> : null}
                </span>
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
